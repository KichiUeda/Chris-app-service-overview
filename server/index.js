/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
const axios = require('axios');
const express = require('express');
const faker = require('faker');
const Overview = require('../database_mongo/index.js');
// const data = require('../database_mongo/seed.js');

const app = express();

app.use(express.static('public', { fallthrough: true }));
app.use('/:product_id', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  res.redirect(`/system_req/${product_id}`);
  res.end();
});

app.get('/system_req/:product_id', (req, res) => {
  console.log('got it');
  const id = req.params.product_id;
  Overview.find({ product_id: id }).then((doc) => {
    // This block has been modified for local use.  For use with all services in place, remove call to google.com and replace with call to description service
    // Also uncomment newGenre const and push that into resArray instead of 'RPG'
    axios
      // .get(`http://ec2-54-224-38-115.compute-1.amazonaws.com:5150/genre/${id}`)
      .get('http://google.com/')
      .then((response) => {
        const resArray = doc;
        // const newGenre = response.data; commented out for local use
        const newGenre = faker.fake('{{company.bsAdjective}} {{hacker.ingverb}}');
        const steamNumber = resArray[0].steam_rating;

        resArray.push(newGenre);
        console.log(resArray);
        if (steamNumber) {
          const describeSteamRating =
            steamNumber >= 95
              ? 'Overwhelmingly Positive'
              : steamNumber >= 80
              ? 'Very Postive'
              : steamNumber >= 70
              ? 'Mostly Positive'
              : steamNumber >= 40
              ? 'Mixed'
              : steamNumber >= 20
              ? 'Mostly Negative'
              : 'Very Negative';
          resArray.push(describeSteamRating);
        }

        return resArray;
      })
      .then((resArray) => {
        res.set({ 'Access-Control-Allow-Origin': '*' });
        res.send(resArray);
      })
      .catch((error) => {
        throw error;
      });
  });
});

app.get('/system_req/platforms/:product_id', (req, res) => {
  const id = decodeURI(req.params.product_id);
  const isItArray = Array.isArray(JSON.parse(id));
  let idArray = [];

  if (isItArray) {
    console.log('made it!');
    idArray = JSON.parse(id);
  } else {
    idArray.push(id);
  }

  Overview.find({ product_id: { $in: idArray } }, (err, docs) => {
    if (err) {
      throw err;
    }
    console.log(docs);
    const resultsArray = docs.map((doc) => {
      const platformsOsObj = {
        product_id: doc.product_id,
        platforms: doc.platforms,
        os: doc.os
      };
      return platformsOsObj;
    });
    res.set({ 'Access-Control-Allow-Origin': '*' });
    if (resultsArray.length > 1) {
      res.send(resultsArray);
    } else {
      res.send(resultsArray[0]);
    }
  });
});

module.exports = app;
