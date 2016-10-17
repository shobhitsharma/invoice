var App = angular.module('portal', ['ngTouch','ui.router','ui.bootstrap','ngAnimate', 'ui.grid','ngSanitize','ui.grid.expandable','ui.grid.pagination','ui.grid.resizeColumns', 'ui.grid.moveColumns','ui.grid.cellNav','ui.grid.autoResize']);
/**
 * Configure the Routes
 */
App.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('export', {
            url: '/',
            templateUrl: 'public/view/main_grid.html',
            controller: 'exportCtrl',
            reload: false
        })

}]);
