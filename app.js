const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const port = process.env.PORT || 3000;

const homeStartingContent = "Welcome to my TechInfo blog. Thank you for being here and reading my first blog post. I am so grateful for my readers already and hope you continue to follow along! Please leave me any ideas or things you would like to see here! This blog will mainly focus on technology, but any additional ideas for blog posts will be appreciated.  Feel free to reach out to me from the Contact Us section of this blog. Happy Reading!";
const aboutContent = "Professionals in almost every industry have trouble keeping up to date with changing tech trends. So, the best and the only way to stay relevant with technology is through the information available online! TechInfo is new publication, good at capturing real insights into the tech world, no stranger to topics like technology, entertainment, science and social media. Informed and comprehensive, TechInfo is basically the perfect tech blog to follow. This unique blog is dedicated to modern life and the technology industry and answers every question related to tech trends, gadget reviews, and the latest updates.";
const contactContent = "Have suggestions or ideas for blog posts? Feel free to reach out to me!";

const app = express();

app.set('view engine', 'ejs');

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE_URL2);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Post.find().then(function(posts){
    res.render("home", {
      contentHome: homeStartingContent,
      postArray: posts,
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {contentAbout: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contentContact: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save().then(function (){
      res.redirect("/");
  });
});

app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;

  Post.findOne({_id: requestedID}).then(function(post){
    res.render("post", {
      titlePost: post.title,
      contentPost: post.content,
    });
  });
});

app.listen(port, function() {
  console.log("Server started on port 3000");
});
