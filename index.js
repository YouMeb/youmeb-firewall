'use strict';

var roles = require('page-roles');

module.exports = function ($youmeb, $routes) {
  var pkg = this;
  var getter = function () {return [];};

  this.define = function () {
    roles.define.apply(roles, arguments);
    return this;
  };

  this.defineUserGroupsGetter = function (fn) {
    if (typeof fn === 'function') {
      getter = fn;
    }
    return this;
  };

  this.middleware = function (req, res, next) {
    roles.check(getter(req), req.$route.security, function (allow) {
      if (allow) {
        return next();
      }
      var err = new Error('403 Forbidden');
      err.status = 403;
      res.send(err);
    });
  };

  $youmeb.on('preGenerateRoutes', function (done) {
    $routes.middlewares['firewall'] = pkg.middleware;
    $routes.scope.middlewares.push('firewall');
    $routes.attr('security', function (parentVal, val) {
      return parentVal || [];
    });
    done();
  });

  $youmeb.on('posGenerateRoutes', function (done) {
    $routes.defineMiddleware('security', pkg.middleware, true);
    $routes.attr('security', function (parentVal, val) {
      return parentVal || [];
    });
    $routes.collection.forEach(function (route) {
      route.security = roles.simplify(route.security);
    });
    done();
  });
};
