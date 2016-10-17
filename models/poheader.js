'use strict';
module.exports = function(sequelize, DataTypes) {
    var POHeader = sequelize.define('poheader', {
        PONumber: { type: DataTypes.STRING },
        PODate: { type: DataTypes.DATE },
        OrderType: { type: DataTypes.STRING },
        Division: { type: DataTypes.STRING },
        PartnerCode: { type: DataTypes.STRING },
        PartnerName: { type: DataTypes.STRING },
        ShipToCode: { type: DataTypes.STRING },
        ShipToName: { type: DataTypes.STRING },
        POERPStatus: { type: DataTypes.STRING }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['deletedAt'] }
        ],
        classMethods: {
            associate: function(models) {
                POHeader.hasMany(models.podetails);
            }
        }
    });

    return POHeader;
};
