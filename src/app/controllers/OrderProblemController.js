import * as Yup from 'yup';
import Order from '../models/Order';
import OrderProblem from '../models/OrderProblem';

class OrderProblemController {
    async index(req, res) {
        const { order_id } = req.params;
        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(400).json('Order does not exits.');
        }

        const orderProblems = await OrderProblem.findAll({
            where: { order_id },
        });

        return res.json(orderProblems);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json('Validation fails');
        }

        const { order_id } = req.params;
        const { description } = req.body;
        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(400).json('Order does not exits.');
        }

        const orderProblem = await OrderProblem.create({
            order_id,
            description,
        });

        return res.json(orderProblem);
    }
}

export default new OrderProblemController();
