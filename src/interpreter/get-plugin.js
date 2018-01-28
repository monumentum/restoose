const nameParser = require('./name-parser');
const { MissingParameter, NeedImplementation } = require('astronode-utils/lib/error');

const { get } = require('lodash');

module.exports = (name, config, prop) => {
    const action = nameParser(name);

    if (action.isPlugin) {
        prop = 'plugins';
    }

    if (!config) {
        throw new MissingParameter('GetPlugin', 'config');
    }

    let plugin = get(config, `${prop}.${action.name}`, null);

    if (!plugin) {
        throw new NeedImplementation(action.name);
    }

    if (action.chain) {
        action.chain.forEach(value => {
            plugin = plugin.apply(null, value);
        });
    }

    return plugin;
};