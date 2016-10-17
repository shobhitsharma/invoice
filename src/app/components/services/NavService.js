(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'My POs',
        icon: 'assignment',
        sref: 'dashboard'
      },
      {
        name: 'Received',
        icon: 'import_export',
        sref: 'received'
      },
      {
        name: 'Exported',
        icon: 'unarchive',
        sref: 'exported'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
