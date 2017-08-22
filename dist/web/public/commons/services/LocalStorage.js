angular
.module('commons')
.service('LocalStorage', function () {
    this.set = function (key, value) {
        localStorage.setItem(key, angular.toJson(value))
    }

    this.get = function (key) {
        let k = localStorage.getItem(key)
        if (!k || k === 'undefined') return null

        return angular.fromJson(k)
    }

    this.clear = function () {
        localStorage.clear()
    }

    return
})
