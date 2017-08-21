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
