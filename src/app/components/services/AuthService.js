(function () {
    'use strict';
    angular.module('app')
        .factory('AuthService', [
            '$http', 'Session','appConf',
            authorization
        ]);

    function authorization($http, Session,appConf) {
        var authService = {};

        authService.redirect = true;

        authService.newSession = function (user) {
            Session.create(user.id, user.type, user.roleCode);
            return user;
        }

        authService.logout = function () {
            Session.destroy();
            $http({
                method: 'GET',
                url:  appConf.baseURL +'/auth/logout'
            });
        }

        authService.isAdmin = function () {

            $http({
                method: 'GET',
                url: appConf.baseURL + '/api/auth'
            }).success(function (status) {
                if (status.user.type == 'admin')
                    return true
                else
                    return false
            }).error(function (err) {
            });

        }

        authService.isAuthenticated = function () {
            $http({
                method: 'GET',
                url: appConf.baseURL + '/api/auth'
            }).success(function (status) {
                alert("status.isAuth:"+status.isAuth)
                if (status.isAuth){
                    return true
                } else{
                    return false
                }
            }).error(function (err) {
            });
        }

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            $http({
                method: 'GET',
                url: appConf.baseURL + '/api/auth'
            }).success(function (status) {
                if (status.user.type == authorizedRoles[0] || status.user.type == authorizedRoles[1]) {
                    return true
                }
                else {
                    return false
                }
            }).error(function (err) {
                return false
            });

        };

        return authService;
    }
})();
