var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var db = require('../config');
var crypto = require('crypto');

var Urls = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
}, {
  timestamps: true
});

Urls.pre('save', function (next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Url = mongoose.model('Url', Urls);



module.exports = Url;

/*
var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});
*/