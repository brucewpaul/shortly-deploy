var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec().then(function(links) {
    res.status(200).send(links);
  });
  /*
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
  */
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  util.getUrlTitle(uri, function(err, title) {
    if (err) {
      console.log('Error reading URL heading: ', err);
      return res.sendStatus(404);
    }

    var link = new Link({
      url: uri,
      baseUrl: req.headers.origin,
      title: title,
    });
    link.save(function (err) {
      if (err) {
        return handleError(err);
      }
      res.status(200).send(link);
    });
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec().then(function(userData) {
    if (!userData) {
      res.redirect('/login');
    }
    userData.comparePassword(password, function(match) {
      if (match) {
        util.createSession(req, res, userData);
      } else {
        res.redirect('/login');
      }
    });
  }).catch(function(error) {
    console.error(error);
  });
};
/*
  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};
*/

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var user = new User({
    username: username,
    password: password
  });
  
  user.save().then(function(err, userData) {
    util.createSession(req, res, userData); 
  });

/*
  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save()
          .then(function(newUser) {
            Users.add(newUser);
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
*/
};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}).exec().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function (err) {
        if (err) {
          return handleError(err);
        }
        res.redirect(link.get('url'));
      });
      // link.set({ visits: link.get('visits') + 1 })
      //   .save()
      //   .then(function() {
      //     return res.redirect(link.get('url'));
      //   });
    }
  });
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};
