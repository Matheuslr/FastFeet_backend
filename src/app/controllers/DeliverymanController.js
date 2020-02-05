import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
    async index(req, res) {
        const deliverymans = await Deliveryman.findAll({
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });
        return res.json(deliverymans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json('Validation fails');
        }

        const deliverymanExists = await Deliveryman.findOne({
            where: { email: req.body.email },
        });

        if (deliverymanExists) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const deliveryman = await Deliveryman.create(req.body);

        return res.json(deliveryman);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json('Validation fails');
        }

        const { deliverymanId } = req.params;
        const { email } = req.body;

        const deliveryman = await Deliveryman.findByPk(deliverymanId);

        if (!deliveryman) {
            return res
                .status(400)
                .json({ error: 'Deliveryman do not exists.' });
        }

        if (email) {
            const deliverymanExists = await Deliveryman.findOne({
                where: { email },
            });

            if (deliverymanExists) {
                return res.status(400).json({ error: 'Email already exists.' });
            }
        }

        const { id, name } = await deliveryman.update(req.body);

        return res.json({ id, name, email });
    }

    async delete(req, res) {
        const { deliverymanId } = req.params;

        const deliveryman = await Deliveryman.findByPk(deliverymanId);

        if (!deliveryman) {
            return res
                .status(400)
                .json({ error: 'Deliveryman do not exists.' });
        }

        await deliveryman.destroy();

        return res.json({
            message: `Recipient ${deliveryman.name} has been deleted.`,
        });
    }
}

export default new DeliverymanController();
