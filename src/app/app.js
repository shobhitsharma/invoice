(function(){
  'use strict';

  angular.module('app', [ 'ngMaterial', 'md.data.table' ])

      .config(['$mdThemingProvider', function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('pink');
      }]);

})();
