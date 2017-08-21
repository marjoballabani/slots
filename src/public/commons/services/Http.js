angular
    .module("commons")
    .factory('Http', function ($http, Utils) {
        return {
            /**
             * GET Request
             * @param url
             * @param data
             * @param success callback
             * @param error callback
             */
            GET: function (url, data, success, error) {
                Utils.showLoadingMask();
                $http({
                    url: url,
                    method: "GET",
                    params: data
                }).then(function (data) {
                    Utils.hideLoadingMask(function () {
                        success(data);
                    });
                }, function (data) {
                    Utils.hideLoadingMask(function () {
                        error(data);
                    });
                });
            },
            /**
             * PUT Request
             * @param url
             * @param data
             * @param success callback
             * @param error callback
             */
            PUT: function (url, data, success, error) {
                Utils.showLoadingMask();
                $http({
                    url: url,
                    method: "PUT",
                    data: Utils.buildFormData(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (data) {
                    Utils.hideLoadingMask(function () {
                        success(data);
                    });
                }, function (data) {
                    Utils.hideLoadingMask(function () {
                        error(data);
                    });
                })
            },
            /**
             * POST Request
             * @param url
             * @param data
             * @param success callback
             * @param error callback
             */
            POST: function (url, data, success, error) {
                Utils.showLoadingMask();
                $http({
                    url: url,
                    method: "POST",
                    data: Utils.buildFormData(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (data) {
                    Utils.hideLoadingMask(function () {
                        success(data);
                    });
                }, function (data) {
                    Utils.hideLoadingMask(function () {
                        error(data);
                    });
                });
            },
            /**
             * POST Request
             * @param url
             * @param data
             * @param success callback
             * @param error callback
             */
            DELETE: function (url, data, success, error) {
                Utils.showLoadingMask();
                $http({
                    url: url,
                    method: "DELETE",
                    params: data
                }).then(function (data) {
                    Utils.hideLoadingMask(function () {
                        success(data);
                    });
                }, function (data) {
                    Utils.hideLoadingMask(function () {
                        error(data);
                    });
                });
            }
        };
    });
