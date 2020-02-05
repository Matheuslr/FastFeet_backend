import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Order from '../models/Order';
import File from '../models/File';
import Queue from '../../libs/Queue';
import RegisterEmail from '../jobs/RegisterMail';
// import File from '../models/File';

class OrderController {
    async index(req, res) {
        const { page } = req.query;

        const orders = await Order.findAll({
            where: { canceled_at: null },
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'name',
                        'street',
                        'number',
                        'complement',
                        'state',
                        'city',
                        'cep',
                    ],
                },
            ],
        });
        return res.json(orders);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json('Validation fails');
        }

        const { recipient_id, deliveryman_id, product } = req.body;

        if (recipient_id) {
            const recipient = await Recipient.findByPk(recipient_id);

            if (!recipient) {
                return res.status(400).json('Recipient does not exists.');
            }
        }

        if (deliveryman_id) {
            const deliveryman = await Deliveryman.findByPk(deliveryman_id);

            const deliverymanDeliveriesCount = await Order.findAndCountAll({
                where: {
                    deliveryman_id,
                    canceled_at: null,
                    end_date: { [Op.ne]: null },
                },
            });

            if (deliverymanDeliveriesCount > 5) {
                return res
                    .status(400)
                    .json({ error: 'Deliveryman already have 5 orders' });
            }
            if (!deliveryman) {
                return res.status(400).json('Deliveryman does not exists.');
            }
        }
        const orderExists = await Order.findOne({
            where: { recipient_id, deliveryman_id, product },
        });

        if (orderExists) {
            return res.status(400).json('This order already exists');
        }

        const createdOrder = await Order.create({
            recipient_id,
            deliveryman_id,
            product,
        });
        const order = await Order.findAll({
            where: { id: createdOrder.id },
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'name', 'email'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: [
                        'name',
                        'street',
                        'number',
                        'complement',
                        'state',
                        'city',
                        'cep',
                    ],
                },
            ],
        });
        await Queue.add(RegisterEmail.key, {
            order,
        });

        return res.json(order[0]);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            product: Yup.string(),
            canceled_at: Yup.date(),
            start_date: Yup.date(),
            end_state: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json('Validation fails');
        }

        const { orderId } = req.params;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(400).json('Order does not exists.');
        }

        const { recipient_id, deliveryman_id, product } = req.body;

        if (recipient_id) {
            const recipient = await Recipient.findByPk(recipient_id);

            if (!recipient) {
                return res.status(400).json('Recipient does not exists.');
            }
        }

        if (deliveryman_id) {
            const deliveryman = await Deliveryman.findByPk(deliveryman_id);

            const deliverymanDeliveriesCount = await Order.findAndCountAll({
                where: {
                    deliveryman_id,
                    canceled_at: null,
                    end_date: { [Op.ne]: null },
                },
            });

            if (deliverymanDeliveriesCount > 5) {
                return res
                    .status(400)
                    .json({ error: 'Deliveryman already have 5 orders' });
            }
            if (!deliveryman)
                return res.status(400).json('Deliveryman does not exists.');
        }
        await order.update({ deliveryman_id, recipient_id, product });
        return res.json({ deliveryman_id, recipient_id, product });
    }

    async delete(req, res) {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(400).json('Order does not exists.');
        }

        await order.destroy();

        return res.json({
            message: `Order ${orderId} has been succefully deleted`,
        });
    }
}

export default new OrderController();
