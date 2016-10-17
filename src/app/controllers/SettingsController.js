(function () {

    angular
        .module('app')
        .controller('SettingsController', [
            '$scope', 'loginFactory',
            SettingsController
        ]);

    function SettingsController($scope, loginFactory) {

        $scope.user = {};
        $scope.userList=null;
        /*
         Grid:
         Username
         Partner Code if more than one partner is assigned to the user  multiple partner codesare separated by
         comma’s
         Email
         Role
         Action (edit / delete)*/
        $scope.gridUsers = [{
            name: 'Username'
        }, {
            name: 'Partner Code'
        }, {
            name: 'Email'
        }, {
            name: 'Role'
        }, {
            name: 'Action'
        }];

        $scope.createUser = function (user) {
            loginFactory.newUser(user).then(function (good) {
                alert(good);
            });
        }

        function getAllUsers() {
            loginFactory.loadAllUsers()
                .then(function (response) {
                    $scope.userList = response.data.data;
                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                    console.log($scope.status);
                });
        }

        getAllUsers();

    }

})();
