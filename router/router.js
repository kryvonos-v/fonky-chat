const assert = require('assert').strict;
const Router = require('@koa/router');

const router = new Router();
const routes = [
  './routes/general/general',
  './routes/auth/auth'
];

routes.forEach(setUpRoute);

function setUpRoute(routePath) {
  const route = require(routePath);
  assert(typeof route.setUp === 'function', `Route '${routePath}' should export setUp function which allows to wire route to the router`);
  route.setUp(router);
}

exports.router = router;

