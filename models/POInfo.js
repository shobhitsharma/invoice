'use strict';
module.exports = function(sequelize, DataTypes) {
    var POInfo = sequelize.define('poinfo', {
        PONumber: { type: DataTypes.STRING },
        PODate: { type: DataTypes.DATE },
        OrderType: { type: DataTypes.STRING },
        Division: { type: DataTypes.STRING },
        PartnerCode: { type: DataTypes.STRING },
        PartnerName: { type: DataTypes.STRING },
        ShipToCode: { type: DataTypes.STRING },
        ShipToName: { type: DataTypes.STRING },
        POERPStatus: { type: DataTypes.STRING },
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
        ]
    });

    return POInfo;
};
