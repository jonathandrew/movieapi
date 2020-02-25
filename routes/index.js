var express = require("express");
var router = express.Router();
const Movies = require("../models/Movies");

/* GET home page. */
router.get("/", function(req, res, next) {
  Movies.find({}).then(movies => {
    res.render("index", { movies: movies });
  });
});

router.post("/", (req, res) => {
  const {
    title,
    rating,
    synopsis,
    release_year,
    genre,
    director,
    box_office
  } = req.body;
  if (
    !title ||
    !rating ||
    !synopsis ||
    !release_year ||
    !genre ||
    !director ||
    !box_office
  ) {
    return res.status(400).json({ message: "broke" });
  }
  Movies.findOne({ title: title })
    .then(movies => {
      console.log(movies);
      if (movies) {
        return res.status(400).json({ message: "movie already handled" });
      }
      const newMovie = new Movies();
      newMovie.title = title;
      newMovie.rating = rating;
      newMovie.synopsis = synopsis;
      newMovie.release_year = release_year;
      newMovie.genre = genre;
      newMovie.director = director;
      newMovie.box_office = box_office;
      newMovie
        .save()
        .then(movie => {
          return res.status(200).json({ message: "movie added", movie });
        })
        .catch(err => {
          return res
            .status(500)
            .json({ message: "movie not added properly", err });
        });
    })
    .catch(err => {
      res.status(500).json({ message: "error somewhere", err });
    });
});
router.put("/:title", (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then(title => {
      if (title) {
        if (req.body.title) {
          title.title = req.body.title;
        }
        title
          .save()
          .then(title => {
            return res.status(200).json({ message: "title changed", title });
          })
          .catch(err => {
            return res
              .status(400)
              .json({ message: "title did not change", err });
          });
      }
    })
    .catch(err => {
      return res
        .status(500)
        .json({ message: "could not find title at all", err });
    });
});

module.exports = router;
