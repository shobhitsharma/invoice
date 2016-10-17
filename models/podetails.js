'use strict';
module.exports = function(sequelize, DataTypes) {
    var PODetails = sequelize.define('podetails', {
        CustomerNumber: { type: DataTypes.STRING },
        FreightAmount: { type: DataTypes.STRING },
        ItemCode: { type: DataTypes.STRING },
        Description: { type: DataTypes.STRING },
        WarehouseCode: { type: DataTypes.STRING },
        PartnerPONumber: { type: DataTypes.STRING },
        UnitofMeasure: { type: DataTypes.STRING },
        QuantityOrdered: { type: DataTypes.STRING },
        QuantityBackordered: { type: DataTypes.STRING },
        QuantityInvoiced: { type: DataTypes.STRING },
        UnitCost: { type: DataTypes.STRING },
        Total: { type: DataTypes.STRING }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['deletedAt'] }
        ],
        classMethods: {
            associate: function(models) {
                PODetails.belongsTo(models.poheader) ;
            }
        }
    });

    return PODetails;
};
