var bundles = require('../bundle.result.json');

module.exports = {
    scripts: function(scriptsBundle) {
        return bundles.shared.scripts + bundles[scriptsBundle].scripts;
    }
}; 