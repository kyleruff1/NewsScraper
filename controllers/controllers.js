const express = require("express");
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');

// setup mongoose connection
const databaseUri = "mongodb://localhost/mongoscraper";
const collections = ["scrapedarticles"];
const mongoose = require("mongoose");

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
const db = mongoose.connection;

const Note = require("../models/notes.js");
const Article = require("../models/articles.js");

var result = {};
var saved = {};

// Simple index route
router.get("/", function(req, res) {
  res.render("index",  {
       title: 'Mongo Scraper'
  });
});

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {
  console.log("called this route");
  
  var result = [];

  request("https://www.nytimes.com/", function(error, response, html) {
    var $ = cheerio.load(html);


    $("article h2").each(function(i, element) {

        // Save the text and href of each link enclosed in the current element
        var headline = $(element).text();   
        var summary = $(element).children("a").text();   
        var link = $(element).children("a").attr("href");

        result.push({
          headline: headline,
          summary: summary,
          link: link
        });

        console.log(headline);

        // If this found element had both a title and a link
        if (result.headline && result.summary && result.link) {

          var newEntry = new Article (result);
          // save the user
          newEntry.save()
        }
        console.log("after new-entry to db")
      });

      res.render('index', {
          title: 'Scaped Articles',
          result
      })
    });
  });

//MyModel.find({}, function (err, docs) {});

router.get("/saved", function(req, res) {
  Article.find({}, function(err, saved) {
      res.render('index', {
          title: 'Saved Articles',
          saved
      });
    });
});


router.post("/save", function(req, res) {
  console.log("req", req.body)

  var Articles = new Article(req.body);  
  Articles.save((err, savedArticles) => {  
    if (err) {
        res.status(500).send(err);
    }
    res.status(200).send(savedArticles);
  });
});



router.post("/note", function(req, res) {
  // Remove a note using the objectID
  var note = new Article(req.body);  
  Article.save((err, savedNote) => {  
    if (err) {
        res.status(500).send(err);
    }
    res.status(200).send(savedNote);
  });
});



router.get("/delete/:id", function(req, res) {
  var condition = "id = " + req.params.id;

  Article.remove({
    "id": req.params.id
  }, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});


module.exports = router;