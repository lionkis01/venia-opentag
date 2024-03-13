const moduleOverridePlugin = require('../moduleOverrideWebpackPlugin');

const componentOverrideProductFullDetail = module.exports = {
    ['@magento/venia-ui/lib/components/ProductFullDetail']:'src/components/ProductFullDetail'
};

module.exports = targets => {

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideProductFullDetail).apply(compiler);
    });

}
