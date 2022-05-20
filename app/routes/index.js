//CONFIG FILE FOR ALL ROUTES

//Import All Routes To The Function
const catalog_routes = require('./catalog-routes');
const product_routes = require('./product-routes');

function registerRoutes(app) {
  app.use('/', catalog_routes);
  app.use('/', product_routes);
}

module.exports.registerRoutes = registerRoutes;
