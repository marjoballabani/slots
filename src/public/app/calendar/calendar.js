angular
.module('app')
.component('calendar', {
    templateUrl: 'app/calendar/calendar.html',
    controller: function (
        DataFactory,
        Pubnub,
        $rootScope,
        $scope
    ) {
        this.slots = DataFactory.slots

        /**
         * Get slot list
         */
        DataFactory.getSlots((success) => {
            this.slots = success.data
        }, (error) => {
            alert(error.data)
        })

        /**
         * Subscribe to channel
         */
        Pubnub.subscribe({
            channels: ['Channel-egrothab8'],
            triggerEvents: ['message']
        })

        /**
         * Do something when you get a message
         */
        $rootScope.$on(Pubnub.getMessageEventNameFor('Channel-egrothab8'), function (ngEvent, envelope) {
            $scope.$apply(function () {
                console.log(envelope.message)
            });
        });

        Pubnub.publish(
            {
                message: {
                    text: 'Hello!'
                },
                channel: 'Channel-egrothab8'
            },
            function (status, response) {
                if (status.error) {
                    console.log(status)
                } else {
                    console.log("message Published")
                }
            }
        );
    }
});