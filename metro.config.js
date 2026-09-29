const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = withNativewind(getDefaultConfig(__dirname), { inlineRem: 16 });
const getDefaultPolyfills = config.serializer.getPolyfills;

config.serializer.getPolyfills = (options) => {
    const polyfills = getDefaultPolyfills ? getDefaultPolyfills(options) : [];

    return [...polyfills, require.resolve("./src/shared/mocks/pretender-global.js")];
};

module.exports = config;
