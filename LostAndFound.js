(function() {
  var Auth, app, common, express, passport;

  common = require('./common');

  common.init();

  Auth = require('./core/Authentication');

  express = common.express;

  app = common.app;

  flash = common.flash;

  passport = common.passport;

  app.configure(function() {
    app.use('/static', express.static(__dirname + '/static'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({
      secret: 'awesome unicorns',
      maxAge: new Date(Date.now() + 3600000),
      store: new common.mongoStore({
        db: common.mongoose.connection.db
      }, function(err) {
        return console.log(err || 'connect-mongodb setup ok');
      })
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    return app.use(app.router);
  });

  app.set('view engine', 'jade');

  app.set('views', __dirname + '/views');

  app.set('view options', {
    layout: false
  });

  require('./routes/Pages')(app, passport);

  require('./routes/Api')(app);

  app.listen(common.port);

  console.log("listening on port ", common.port);

  console.log("mongodb url ", common.mongourl);

  console.log("node env ", common.env);

}).call(this);
