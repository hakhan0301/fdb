const withTM = require("next-transpile-modules")(["@fdb/ui"]);

module.exports = withTM({
  reactStrictMode: true,
});
