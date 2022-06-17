const withPlugins = require('next-compose-plugins');

const withTM = require("next-transpile-modules")([
  "@fdb/ui",
  "@fdb/db"
]);
const withPWA = require('next-pwa');

module.exports = withPlugins([
  withPWA({ pwa: { dest: 'public' } }),
  withTM({ reactStrictMode: true, }),
]);
