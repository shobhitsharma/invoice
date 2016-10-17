var models = require('../models');
var Promise = require('bluebird');
var moment = require('moment') //timing utulity module

var service = module.exports = {
    listPOs: function () {
        return models.poheader.findAll();
    },
    listPOsCode:function(params){
        return models.poheader.findAll({
            where: {
                PartnerCode: params.PartnerCode
            }
        });
    },
    getPOHeader:function(params){
        return models.poheader.findAll({
            where: {
                PONumber: params.PONumber
            }
        });
    },
    getPOHeaderCode:function(params){
        return models.poheader.findAll({
            where: {
                PONumber: params.PONumber,
                PartnerCode: params.PartnerCode
            }
        });
    },
    getAllPos: function (params) {
        var DATE_RANGE;
        var now = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

        if (params.dateRange == 30) {
            DATE_RANGE = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 30: ' + DATE_RANGE)

            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else if (params.dateRange == 60) {
            DATE_RANGE = moment().subtract(60, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 60: ' + DATE_RANGE)
            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else if (params.dateRange == 7) {

            DATE_RANGE = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 7: ' + DATE_RANGE)
            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else if (params.dateRange == 1) {

            DATE_RANGE = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log(new Date() + ' GTe 1: ' + DATE_RANGE)

            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else {
            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber
                },
                include: [{model: models.podetails}],

            });
        }

    },
    getPOs: function (params) {
        var DATE_RANGE;
        var now = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

        if (params.dateRange == 30) {
            DATE_RANGE = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 30: ' + DATE_RANGE)

            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else if (params.dateRange == 60) {
            DATE_RANGE = moment().subtract(60, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 60: ' + DATE_RANGE)
            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else if (params.dateRange == 7) {

            DATE_RANGE = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 7: ' + DATE_RANGE)
            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else if (params.dateRange == 1) {

            DATE_RANGE = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log(new Date() + ' GTe 1: ' + DATE_RANGE)

            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                },
                include: [{model: models.podetails}]
            });
        } else {
            return models.poheader.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PartnerCode: params.PartnerCode
                },
                include: [{model: models.podetails}]
            });
        }
    }

}