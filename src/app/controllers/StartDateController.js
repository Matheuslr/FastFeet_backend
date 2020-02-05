import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class StartDateController {
    async update(req, res) {
        const schema = Yup.object().shape({
            start_date: Yup.date().required(),
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

        const alreadyOutForDelivery = order.start_date;

        if (alreadyOutForDelivery) {
            return res.status(400).json('Order already out for delivery.');
        }

        const alreadyCanceled = order.canceled_at;

        if (alreadyCanceled) {
            return res.status(400).json('Order already canceled.');
        }

        const nowDate = new Date();

        if (nowDate.getHours() - 1 < 8 || nowDate.getHours() - 1 >= 18) {
            return res.status(400).json('The warehouse is closed.');
        }
        const { start_date } = req.body;

        if (
            isBefore(
                parseISO(start_date),
                new Date().setHours(nowDate.getHours() - 1)
            )
        ) {
            return res
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }

        await order.update(start_date);

        return res.json(order);
    }
}

export default new StartDateController();
