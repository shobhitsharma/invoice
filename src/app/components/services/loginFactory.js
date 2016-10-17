(function () {
    'use strict';
    angular.module('app')
        .factory('loginFactory', [
            '$http', '$q', 'appConf',
            login
        ]);

    function login($http, $q, appConf) {

        var loginFctry = {};
        $http.defaults.useXDomain = true;

        loginFctry.login = function (user) {
            var deferred = $q.defer();
            /*
             deferred.resolve(user);*/

            $http({
                method: 'POST',
                url: appConf.baseURL + '/auth/authenticate', data: {username: user.username, password: user.password}
            }).success(function (data) {
                if (data.success) {
                    deferred.resolve(data.user);
                } else {
                    deferred.reject();
                }
            }).error(function (err, status, headers, config) {
               // alert("authentication went wrong");
                alert("authenticate field");
                deferred.reject(err);
            });

            return deferred.promise;
        }

        loginFctry.newUser = function (user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appConf.baseURL + '/api/user/new',
                data: {
                    username: user.username,
                    password: user.password,
                    type: user.type,
                    code: user.code,
                    email: user.email
                }

            }).success(function (data) {
                //debugger;
                if (data.success) {
                    deferred.resolve(data.msg);
                } else {
                    deferred.reject();
                }
            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        loginFctry.loadAllUsers = function () {
            return $http.get('http://localhost:3000/api/users');
        }

        loginFctry.logout = function () {
            return $http.get('http://localhost:3000/api/logout');
        }
        return loginFctry;
    }

})();

