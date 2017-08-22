angular.module('app')
.config(function (
    $stateProvider,
    $urlRouterProvider
) {

    $urlRouterProvider.otherwise('/calendar')

    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'app/app.html',
            controllerAs: '$ctrl',
            controller: function (
            ) {
            }
        })
        .state('app.calendar', {
            url: '/calendar',
            abstract: false,
            component: "calendar"
        })

})
