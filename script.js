import express from "express";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/* mongoose db setup  */
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

/* end of database connection setup */

//  chaining the routes - request targeting all articles

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const bear = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    bear.save((err) => {
      if (!err) {
        res.send("Successfully added the data");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all records!");
      } else {
        res.send(err);
      }
    });
  });

//request targeting specific article

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne(
      { title: _.lowerCase(req.params.articleTitle) },
      (err, results) => {
        if (results) {
          res.send(results);
        } else {
          res.send("No such article was found");
        }
      }
    );
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated article!");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated article!");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted article!");
      }
    });
  });

app.listen(3100, () => {
  console.log("Server running on port 3100");
});
