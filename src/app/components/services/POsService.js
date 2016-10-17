(function () {
    'use strict';

    angular.module('app')
        .service('POsService', [
            '$http', '$q',
            POsService
        ]);

    function POsService($http) {

        /*
         $http.get('/someUrl', config).then(successCallback, errorCallback);
         $http.post('/someUrl', data, config).then(successCallback, errorCallback);
        */

        return {
            loadAllItems: function () {
                return $http.get('http://localhost:3000/api/pos');
            },
            loadPOHeader:function(params){
                return $http.get('http://localhost:3000/api/pos/'+params.PONumber);
            },
            getPOs: function (params) {
                return $http.post('http://localhost:3000/api/po/' + params.PONumber,{dateRange:params.dateRange});
            }
        };
    }
})();
