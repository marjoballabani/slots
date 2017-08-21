/**
 * Created by Marjo on 1/5/2016.
 */
angular
.module("commons")
.factory('DataFactory', function (
    Http,
    Constants
) {
    var dataFactory = {};
    dataFactory.slots = []

    /**
     * Calendar config object
     */
    dataFactory.uiConfig = {
        height: 'parent',
        editable: true,
        defaultView: 'agendaWeek',
        header: {
            left: 'month agendaWeek',
            center: 'title',
            right: 'today prev,next'
        }
    };

    dataFactory.getSlots = (success, error) => {
        Http.GET(
            Constants.Url.SLOTS,
            {},
            success,
            error
        )
    };

    return dataFactory;
});
