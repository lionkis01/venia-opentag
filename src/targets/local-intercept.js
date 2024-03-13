const moduleOverridePlugin = require('../moduleOverrideWebpackPlugin');

const componentOverrideProductFullDetail = module.exports = {
    ['@magento/venia-ui/lib/components/ProductFullDetail']:'src/components/ProductFullDetail'
};

module.exports = targets => {

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideProductFullDetail).apply(compiler);
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
