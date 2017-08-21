angular
.module('app')
.component('calendar', {
    templateUrl: 'app/calendar/calendar.html',
    controller: function (
        DataFactory,
        Pubnub
    ) {
        this.slots = DataFactory.slots
        DataFactory.getSlots((success) => {
            console.log(success.data)
            this.slots = success.data
        }, (error) => {
            alert(error.data)
        })
    }
});