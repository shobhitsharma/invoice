App.service('poinfo', function ($http) {

    return {
        all: function () {
            return $http.get('/api/pos').then(function (POInfo) {
                return POInfo.data.data;
            });
        }
    };
});

