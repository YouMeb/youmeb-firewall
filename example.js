'use strict';

var path = require('path');

module.exports = function (done) {

  var youmeb = this;

  this.express(function (app, express) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
  });

  this.routes();

  this.on('posLoadUserPackages', function () {
    youmeb.invoke(function ($firewall) {
      $firewall.define({
        admin: ['user']
      });
      $firewall.defineUserGroupGetter(function (req) {
        return req.user.groups;
      });
    });
  });

  done();
};
