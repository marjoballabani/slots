angular
.module('app')
.component('calendar', {
    templateUrl: 'app/calendar/calendar.html',
    controller: function (
        DataFactory,
        Pubnub,
        $rootScope,
        $scope,
        uiCalendarConfig,
        ngDialog
    ) {
        $scope.slots = DataFactory.slots
        $scope.selectedEvent = {}
        this.events = []

        /**
         * Get slot list
         */
        DataFactory.getSlots((success) => {
            $scope.slots = success.data
            this.renderCalendar()
        }, (error) => {
            alert(error.data)
        })

        /**
         * Show event form
         */
        this.showForm = (date, jsEvent, view) => {
            $scope.selectedEvent = date
            ngDialog.open({
                template: 'app/templates/form.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                controller: ($scope) => {
                    var a = $scope.changeStatus()
                    console.log(a)
                }
            });
        }

        /**
         * Change event status
         */
        $scope.changeStatus = () => {
            return $scope.slots.filter(function( event ) {
                return event.id == $scope.selectedEvent.id;
            })[0]
        }

        /**
         * Generate events from slots data
         */
        this.renderCalendar = () => {
            var avEvents = []
            var notAvEvents = {
                color: 'red',
                events: []
            }
            $scope.slots.forEach((element) => {
                var temp = {
                    id: element.id,
                    status: element.available,
                    start: new Date(element.startTime),
                    end: new Date(element.endTime),
                }
                element.available == true ? avEvents.push(temp) : notAvEvents.events.push(temp)
            });
            this.events.push(notAvEvents)
            this.events.push(avEvents)
            uiCalendarConfig.calendars['calendar'].fullCalendar('refetchEvents');
            uiCalendarConfig.calendars['calendar'].fullCalendar('gotoDate', $scope.slots[0].startTime);
        }

        /**
         * Test PubNub publish
         */
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

        /**
         * Subscribe to channel
         */
        Pubnub.subscribe({
            channels: ['Channel-egrothab8'],
            triggerEvents: ['message']
        })

        /**
         * Do something when you get a message from PubNub
         */
        $rootScope.$on(Pubnub.getMessageEventNameFor('Channel-egrothab8'), function (ngEvent, envelope) {
            $scope.$apply(function () {
                console.log(envelope.message)
            });
        });

        /**
         * Calendar config object
         */
        this.uiConfig = {
            calendar: Object.assign(DataFactory.uiConfig, {
                eventClick: this.showForm
            })
        }
    }
});