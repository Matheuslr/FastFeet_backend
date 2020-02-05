// import { format } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Mail from '../../libs/Mail';

class RegisterMail {
    get key() {
        return 'RegisterMail';
    }

    async handle({ data }) {
        const { order } = data;
        await Mail.sendMail({
            to: `${order[0].deliveryman.name} <${order[0].deliveryman.email}>`,
            subject: 'Nova encomenda ',
            template: 'register',
            context: {
                deliveryman: order[0].deliveryman.name,
                name: order[0].recipient.name,
                street: order[0].recipient.street,
                number: order[0].recipient.number,
                complement: order[0].recipient.complement,
                state: order[0].recipient.state,
                city: order[0].recipient.city,
                cep: order[0].recipient.cep,
            },
        });
    }
}

export default new RegisterMail();
