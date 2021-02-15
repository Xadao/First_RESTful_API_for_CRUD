//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true, useUnifiedTopology:true});
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article", articleSchema);
app.route("/articles")
.get(
    function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles)
            } else {
                console.error(err);
            }
           
        })
    }
)
.post(
    function (req, res) {
    
    

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
    
        newArticle.save(function (err) {
            if (!err) {
                res.send("Succesfully added a new article")
            }else{
    
            }res.send(err)
        });
    }
)
.delete(
    function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("succesfully deleted all the articles")
            }else{res.send(err)}
        })
    }
)
// specific article get
app.route("/articles/:arTitle")
.get( function (req, res) {
    Article.findOne({title: req.params.arTitle}, function (err, foundArticle) {
        if (!err) {
            res.send(foundArticle)
        }else{res.send(err)}
    })
})
.put(function (req, res) {
    Article.updateOne(
        {title: req.params.arTitle},
        {$set: {title: req.body.title, content: req.body.content}},
        function (err) {
            if (!err) {
                res.send("succesfully updated article")
            }
        }
        )
})
.patch(function (req, res) {
    Article.updateOne(
        {title: req.params.arTitle},
        {$set: req.body},
        function (err) {
            if (!err) {
                res.send("succesfully updated article")
            }
        }
        )
})
.delete(function (req, res) {
    Article.deleteOne({title : req.params.arTitle}, function (err) {
        if (!err) {
            res.send("succesfully deleted")
        }
    })
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });