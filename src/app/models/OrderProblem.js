import Sequelize, { Model } from 'sequelize';

class OrderProblem extends Model {
    static init(sequelize) {
        super.init(
            {
                order_id: Sequelize.NUMBER,
                description: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, {
            foreignKey: 'order_id',
            as: 'order',
        });
    }
}

export default OrderProblem;
