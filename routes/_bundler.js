var prodBundles = require('../public/bundles/bundle.result.json');
var devBundles = require('../public/bundles/bundle.debug.json');

module.exports = {
    scripts: function(scriptsBundle) {
        var bundles = !process.env.NODE_ENV ? devBundles : prodBundles;
        return bundles.shared.scripts + bundles[scriptsBundle].scripts;
    }
}; 