import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async index(req, res) {
        const recipients = await Recipient.findAll({});
        return res.json(recipients);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            cep: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'Missing parameter(s)',
            });
        }

        const { name, number, cep } = req.body;

        const recipientExists = await Recipient.findOne({
            where: {
                name,
                number,
                cep,
            },
        });

        if (recipientExists) {
            return res.status(400).json({
                error: 'Recipient already exists',
            });
        }

        const inserted_recipient = await Recipient.create(req.body);
        return res.json(inserted_recipient);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            street: Yup.string(),
            number: Yup.number(),
            complement: Yup.string(),
            state: Yup.string(),
            city: Yup.string(),
            cep: Yup.string(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'Missing parameter(s)',
            });
        }
        const { id } = req.params;
        const recipient = await Recipient.findByPk(id);
        const updated_recipient = await recipient.update(req.body);
        return res.json(updated_recipient);
    }

    async delete(req, res) {
        const { id } = req.params;
        const recipient = await Recipient.findByPk(id);
        await recipient.destroy(req.body);
        return res.json({
            message: `Recipient ${recipient.name} has been deleted.`,
        });
    }
}

export default new RecipientController();
