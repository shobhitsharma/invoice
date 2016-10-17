var models = require('../models');
var Promise = require('bluebird');

var service = module.exports = {
    listUsers: function () {
        return models.user.findAll();
    },
    findUsers: function(params){
        return models.user.findAll({
            where: {
                username: params.username,
                code: params.code
            }
        });
    }
}