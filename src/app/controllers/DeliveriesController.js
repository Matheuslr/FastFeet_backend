import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveriesController {
    async index(req, res) {
        const { deliveryman_id } = req.params;

        const deliveryman = await Deliveryman.findByPk(deliveryman_id);

        if (!deliveryman) {
            return res.status(400).json('Deliveryman does not exists ');
        }

        const orders = await Order.findAll({
            where: {
                deliveryman_id,
                canceled_at: null,
                end_date: { [Op.ne]: null },
            },
        });

        return res.json(orders);
    }
}

export default new DeliveriesController();
