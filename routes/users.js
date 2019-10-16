const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/user");

//get all user
router.get("/", (req, res, next) => {
  User.find()
    .select("email password _id")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            email: doc.email,
            password: doc.password,
          };
        })
      };
      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: "No entries found"
      //   });
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/me", (req, res, next) => {
  res.status(200).json({
    message: "Order were fetched"
  });
});

router.post("/register", (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exist"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: "User created"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  const order = {
    email: req.body.email,
    password: req.body.password
  };
  console.log(order)
  res.status(201).json({
    message: "Order was created",
    order
  });
});

module.exports = router;
