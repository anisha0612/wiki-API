import express from "express";
import mongoose from "mongoose";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

/* mongoose db setup  */
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

/* end of database connection setup */

//  get route

app.get("/articles", (req, res) => {
  Article.find((err, results) => {
    if (!err) {
      res.send(results);
    } else {
      res.send(err);
    }
  });
});

app.post("/articles", (req, res) => {
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
});

app.delete("/articles", (req, res) => {
  Article.deleteMany((err) => {
    if (!err) {
      res.send("Successfully deleted all records!");
    } else {
      res.send(err);
    }
  });
});

app.listen(3100, () => {
  console.log("Server running on port 3100");
});
