// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');
const { json } = require('body-parser');
require('dotenv').config();

const app = express();

// for using local css and images
app.use(express.static('public'));

// for handling POST request
app.use(bodyParser.urlencoded({ extended: true }));

// getting the response at web browser
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

// making POST request
app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = process.env.MAILCHIMP_URL;

  const options = {
    method: 'POST',
    auth: process.env.MAILCHIMP_KEY,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

/*
  To run below code we need to make the "button inside the form in failure.html page and set action="/failure" and method="post" "
*/
app.post('/failure', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
