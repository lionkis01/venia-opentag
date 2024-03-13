const moduleOverridePlugin = require('../moduleOverrideWebpackPlugin');

const componentOverrideProductFullDetail = module.exports = {
    ['@magento/venia-ui/lib/components/ProductFullDetail']:'src/components/ProductFullDetail'
};
const componentLogo = module.exports = {
    ['@magento/venia-ui/lib/components/Logo']:'src/components/Logo'
};
const componentOverRiddingLogo = module.exports = {
    ['@magento/peregrine/lib/util/makeUrl.js']:'src/components/talons/makeUrl.js'
};

module.exports = targets => {

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideProductFullDetail).apply(compiler);
    });

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentLogo).apply(compiler);
    });

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverRiddingLogo).apply(compiler);
    });

    targets.of("@magento/venia-ui").routes.tap(routes => {
        routes.push({
            name: "CustomCmsBlock",
            pattern: "/customcmsblock",
            path: require.resolve("../components/CustomCmsBlock/customCmsBlock.js")
        });
        return routes;
    });

}
