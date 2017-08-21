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
        this.slots = DataFactory.slots
        this.selectedEvent = {}
        this.history = []
        this.events = []

        /**
         * Get slot list
         */
        DataFactory.getSlots((success) => {
            this.slots = success.data
            this.renderCalendar()
        }, (error) => {
            alert(error.data)
        })

        /**
         * Show event form
         */
        this.showForm = (date, jsEvent, view) => {
            if (date.status) {
                this.selectedEvent = date
                ngDialog.open({
                    template: 'app/templates/form.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    controller: () => {
                        this.publish()
                    }
                });
            }
        }

        /**
         * Change event status
         */
        this.changeStatus = (id) => {
            this.events[0].filter((event) => {
                return event.id == id;
            })[0].color = "#D84315";
            uiCalendarConfig.calendars['calendar'].fullCalendar('removeEventSource', this.events[0]);
            uiCalendarConfig.calendars['calendar'].fullCalendar('addEventSource', this.events[0]);
            this.history.push(id)
        }

        /**
         * Generate events from slots data
         */
        this.renderCalendar = () => {
            var tempEvents = []
            this.slots.forEach((element) => {
                var temp = {
                    id: element.id,
                    status: element.available,
                    start: new Date(element.startTime),
                    end: new Date(element.endTime),
                    color: element.available == true ? "#3F51B5" : "#D84315"
                }
                tempEvents.push(temp)
            });
            this.events.push(tempEvents)
            uiCalendarConfig.calendars['calendar'].fullCalendar('refetchEvents');
            uiCalendarConfig.calendars['calendar'].fullCalendar('gotoDate', this.slots[0].startTime);
        }

        /**
         * Subscribe to channel
         */
        Pubnub.subscribe({
            channels: ['Channel-egrothab8'],
            triggerEvents: ['message']
        })

        /**
         * Publish changes to other users
         */
        this.publish = () => {
            Pubnub.publish(
                {
                    message: {
                        id: this.selectedEvent.id
                    },
                    channel: 'Channel-egrothab8'
                },
                function (status) {
                    if (status.error) {
                        console.log(status)
                    } else {
                        console.log("message Published")
                    }
                }
            );
        }

        /**
         * Do something when you get a message from PubNub
         */
        $rootScope.$on(Pubnub.getMessageEventNameFor('Channel-egrothab8'), (ngEvent, envelope) => {
            $scope.$apply(() => {
                envelope.message.id
                this.changeStatus(envelope.message.id)
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