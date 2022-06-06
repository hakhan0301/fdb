const withTM = require("next-transpile-modules")([
  "@fdb/ui",
  "@fdb/db"
]);

module.exports = withTM({
  reactStrictMode: true,
});
