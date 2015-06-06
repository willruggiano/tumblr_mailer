var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'f95dsQXWqJ4LDFHdufL0fp9vs9mDFkRXySRW1YhbUcdTOBUMl4',
  consumer_secret: 'gvPP0rqCh7ttNWl71lanojjSXMpBqaW7xoPwjbyun3WmrsK4jE',
  token: 'FR7Hx367y7oaQYI2qO3029tarL4XJlgqkWA47r57z2WWEJesJA',
  token_secret: 'iHFX5qIBUE4o1QN9aXuKW6NS4fM1R9IE9YgLswHDIeZxwCTeML'
});

// Make the request
client.userInfo(function (err, data) {
    // ...
});

function getLatestPosts() {
  var latestPosts = [];
  client.posts('willruggiano.tumblr.com', function(err, blog){
    for (var i = 0; i < blog.posts.length; i++) {
      if (Date.parse(new Date()) - Date.parse(blog.posts[i].date) <= 604800000) {
        latestPosts.push(blog.posts[i]);
        console.log(blog.posts[i])
      }
    }
  });
  return latestPosts;
}

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var email_template = fs.readFileSync("email_template.ejs", "utf8");

function csvParse(csvFile) {
  var csvParsed = [];
  var contact = {
    firstName: "",
    lastName: "",
    numMonthsSinceContact: "",
    emailAddress: ""
  };
  var keys = Object.keys(contact);
  csvFile = csvFile.split("\n");
  for (var i = 1; i < csvFile.length-1; i++) {
    var line = csvFile[i].split(",");
    for (var j = 0; j < line.length; j++) {
      contact[keys[j]] = line[j];
    }
  }

  contact.latestPosts = getLatestPosts();
  csvParsed.push(contact);
  //var contacts = csvParse(csvFile);
  //console.log(contact);
  console.log(contact);
  // return csvParsed;
}

csvParse(csvFile)
// var customizedTemplate = ejs.render(email_template, contacts[0]);

// console.log(customizedTemplate);
// 7 days = 604800000 milliseconds
// var current = Date.parse(new Date());
// should: retrieve most recent posts
// should: add as value of latestPosts property in contact Object
