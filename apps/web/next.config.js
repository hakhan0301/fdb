const withPlugins = require('next-compose-plugins');

const withTM = require("next-transpile-modules")([
  "@fdb/ui",
  "@fdb/db"
]);

module.exports = withPlugins([
  withTM({ reactStrictMode: true, }),

]);
