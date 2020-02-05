import Order from '../models/Order';

class ProblemHandlerController {
    async update(req, res) {
        const { order_id } = req.params;

        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(400).json('Order does not exist .');
        }

        const { canceled_at, end_date } = order;

        if (canceled_at) {
            return res.status(400).json('Order already been canceled.');
        }

        if (end_date) {
            return res.status(400).json('Order already been withdrawn.');
        }

        await order.update({ canceled_at: new Date() });

        return res.json(order);
    }
}

export default new ProblemHandlerController();
