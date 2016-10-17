(function () {
    angular
        .module('app')
        .controller('LoginController', [
            '$scope','loginFactory',
            LoginController
        ]);

    function LoginController($scope, loginFactory) {

        $scope.user = {};

        $scope.login = function(user){
            loginFactory.login($scope.user).then(function(user){
                $scope.setUser({id:user.id,username:user.username,type:user.type,code:user.code,email:user.email,isAuth:true});
            });
        }

    }
})();
