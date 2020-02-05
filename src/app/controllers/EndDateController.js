import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class EndDateController {
    async update(req, res) {
        const schema = Yup.object().shape({
            signature_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json('Validation fails');
        }

        const { deliveryman_id, order_id } = req.params;

        const deliveryman = await Deliveryman.findByPk(deliveryman_id);

        if (!deliveryman) {
            return res.status(400).json('Deliveryman does not exist .');
        }

        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(400).json('Order does not exist .');
        }

        const alreadyCanceled = order.canceled_at;

        if (alreadyCanceled) {
            return res.status(400).json('Order already canceled.');
        }

        const alreadyOutForDelivery = order.start_date;

        if (!alreadyOutForDelivery) {
            return res.status(400).json('Order needs to be withdrawn first.');
        }

        const alreadyDelivered = order.end_date;

        if (alreadyDelivered) {
            return res.status(400).json('Order already been delivered.');
        }

        const { signature_id } = req.body;

        const signature = await File.findByPk(signature_id);

        if (!signature) {
            return res.status(400).json('Signature does not exists .');
        }

        await order.update({ end_date: new Date(), signature_id });

        return res.json(order);
    }
}

export default new EndDateController();
