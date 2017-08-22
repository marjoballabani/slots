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
        this.userInput = {
            name: "",
            email: "",
            phone: ""
        }

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
         * Show Popup form when event is clicked
         */
        this.showForm = (date, jsEvent, view) => {
            this.userInput = {
                name: "",
                email: "",
                phone: ""
            }
            if (date.status) {
                this.selectedEvent = date
                ngDialog.open({
                    template: 'app/templates/form.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    controller: ($scope) => {
                        $scope.submitForm = () => {
                            this.publish()
                        }
                    }
                });
            }
        }

        /**
         * On form submit change event status
         */
        this.changeStatus = (id, user) => {
            var tmp = this.events[0].filter((event) => {
                return event.id == id;
            })[0]
            tmp.color = "#D84315";
            tmp.status = false;
            uiCalendarConfig.calendars['calendar'].fullCalendar('removeEventSource', this.events[0]);
            uiCalendarConfig.calendars['calendar'].fullCalendar('addEventSource', this.events[0]);
            this.history.push({
                id: id,
                user: user
            })
        }

        /**
         * Generate events data from slots data
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
         * Subscribe to PubNub channel
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
                        id: this.selectedEvent.id,
                        user: this.userInput
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
         * Change Event status when a user make a reservation in real time
         */
        $rootScope.$on(Pubnub.getMessageEventNameFor('Channel-egrothab8'), (ngEvent, envelope) => {
            $scope.$apply(() => {
                this.changeStatus(envelope.message.id, envelope.message.user)
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