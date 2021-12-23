const bodyParser = require("body-parser");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/BlogsDB");

//BLOGS SCHEMA

const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  content: String,
  created: { type: Date, default: Date.now },
});

const Blog = mongoose.model("blog", blogSchema);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (error, blogs) => {
    if (error) {
      console.log(error);
    } else {
      res.render("index", { blogs });
    }
  });
});

app.post("/blogs", (req, res) => {
  let title = req.body.title;
  let image = req.body.image;
  let content = req.body.content;

  Blog.create(
    {
      title,
      image,
      content,
    },
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/blogs");
        console.log(result);
      }
    }
  );
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.get("/blogs/:id", (req, res) => {
  let id = req.params.id;
  Blog.findById(id, (error, blog) => {
    if (error) {
      console.log(error);
    } else {
      res.render("show", { blog });
      console.log(blog);
    }
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (error, blog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog });
    }
  });
});

app.put("/blogs/:id", (req, res) => {
  var id = req.params.id;
  var newObject = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
  };

  Blog.findByIdAndUpdate(id, newObject, (error, updated) => {
    if (error) {
      console.log(error);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + id);
      console.log(updated);
    }
  });
});

app.delete("/blogs/:id", (req, res) => {
  let id = req.params.id;

  Blog.findByIdAndRemove(id, (error) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, (req, res) => {
  console.log("Server Is Running on Port 3000");
});
