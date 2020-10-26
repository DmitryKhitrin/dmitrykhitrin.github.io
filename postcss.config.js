const packageImporter = require('node-sass-package-importer');

const cssnanoConfig = {
    preset: ['default', {discardComments: {removeAll: true}}],
};

module.exports = {
    parser: 'postcss-safe-parser',
    plugins: {
        'postcss-node-sass': {
            importer: packageImporter(),
            sourceMapEmbed: true,
        },
        'autoprefixer': true,
        'cssnano': cssnanoConfig,
    },
};
