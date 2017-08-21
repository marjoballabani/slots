angular
.module('app', [
    'ui.router',
    'commons',
    'angular.filter',
    'pubnub.angular.service'
])
.config(function (
    $compileProvider
) {
    // auto-bindings to prevent using $onInit
    $compileProvider.preAssignBindingsEnabled(true);
})
.run(function (
    Pubnub
) {
    Pubnub.init({
        publishKey: 'pub-c-55f1ba35-5d47-4e93-9eb9-fbade0537c0a',
        subscribeKey: 'sub-c-0f69e5ba-819f-11e7-b8cd-f652352d4e79'
    });
})
