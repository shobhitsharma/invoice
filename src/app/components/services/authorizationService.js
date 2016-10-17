(function () {
    'use strict';

    // authorization service's purpose is to wrap up authorize functionality
    // it basically just checks to see if the principal is authenticated and checks the root state
    // to see if there is a state that needs to be authorized. if so, it does a role check.
    // this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
    // route, the app resolves your identity before it does an authorize check. after that,
    // authorize is called from $stateChangeStart to make sure the principal is allowed to change to
    // the desired state

    angular.module('app')
        .service('authorization', [
            '$rootScope', '$state', 'principal',
            authorization
        ]);

    function authorization($rootScope, $state, principal) {
        return {
            authorize: function () {
                return principal.identity()
                    .then(function () {
                        var isAuthenticated = principal.isAuthenticated();

                        if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                            if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
                            else {
                                // user is not authenticated. stow the state they wanted before you
                                // send them to the signin state, so you can return them when you're done
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;

                                // now, send them to the signin state so they can log in
                                $state.go('login');
                            }
                        }
                    });
            }
        };
    }
})();
