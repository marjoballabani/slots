let _ = require('lodash'),
    defaultConfig = require('./config-default'),
    local = {};

module.exports = (env) => {
    if (env === 'prod') {
        local = require('./config-prod')
    } else {
        try {
            local = require('./config-local');
        } catch (err) {}
    }
    return _.defaultsDeep(local, defaultConfig);
}
