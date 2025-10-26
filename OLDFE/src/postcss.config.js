// postcss.config.js
module.exports = {
    plugins: [
        require('postcss-prefix-selector')({
            prefix: '.homepaag',
            transform: function (prefix, selector, prefixedSelector, filePath) {
                if (selector.startsWith('.exclude-this')) {
                    return selector; // Skip prefixing for these selectors
                }
                return prefixedSelector;
            },
        }),
        // Add other PostCSS plugins here if needed
    ],
};
