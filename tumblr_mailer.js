var fs = require('fs');
var ejs = require('ejs');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('mmEr-aGlpAq5p9PfFbmV3A');

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var email_template = fs.readFileSync("email_template.ejs", "utf8");

var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'f95dsQXWqJ4LDFHdufL0fp9vs9mDFkRXySRW1YhbUcdTOBUMl4',
  consumer_secret: 'gvPP0rqCh7ttNWl71lanojjSXMpBqaW7xoPwjbyun3WmrsK4jE',
  token: 'FR7Hx367y7oaQYI2qO3029tarL4XJlgqkWA47r57z2WWEJesJA',
  token_secret: 'iHFX5qIBUE4o1QN9aXuKW6NS4fM1R9IE9YgLswHDIeZxwCTeML'
});


client.posts('willruggiano.tumblr.com', function(err, blog){
  var latestPosts = [];
  blog.posts.forEach(function(post){
    if (Date.parse(new Date()) - Date.parse(post.date) <= 604800000) {
      latestPosts.push(post);
    }
  });
  contactList = csvParse(csvFile);

  contactList.forEach(function(contact){
    var firstName = contact.firstName;
    var numMonthsSinceContact = contact.numMonthsSinceContact;
    var emailAddress = contact.emailAddress;
    var customizedTemplate = ejs.render(email_template, {firstName: firstName, numMonthsSinceContact: numMonthsSinceContact, latestPosts: latestPosts});
    sendEmail(firstName, emailAddress, "Will Ruggiano", "will@ruggianofamily.com", "Check out my blog!", customizedTemplate);
  });
  console.log("email sent!");
});


function csvParse(csvFile) {
  var friendsList = [];
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
  friendsList.push(contact);
  return friendsList;
}


function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
	var message = {
	    "html": message_html,
	    "subject": subject,
	    "from_email": from_email,
	    "from_name": from_name,
	    "to": [{
	            "email": to_email,
	            "name": to_name
	        }],
	    "important": false,
	    "track_opens": true,
	    "auto_html": false,
	    "preserve_recipients": true,
	    "merge": false,
	    "tags": [
	        "Fullstack_Tumblrmailer_Workshop"
	    ]
	};
	var async = false;
	var ip_pool = "Main Pool";
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {

	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
}
