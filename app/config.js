var mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://127.0.0.1/shortly');


/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urls = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
}, {
  timestamps: true
});

var users = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
}, {
  timestamps: true
});

module.exports = db;
*/

/*
var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});
*/

