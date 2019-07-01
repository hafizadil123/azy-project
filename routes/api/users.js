const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateForgotInput = require("../../validation/forgotPassword");
const validateUpdateInput = require("../../validation/updatePassword");
// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  // const { errors, isValid } = validateRegisterInput(req.body);

  // // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // errors.email = "Email already exists";
      return res.status(400).json({code: '400', errors: 'Email already exist'});
    } else {
      User.findOne({refferalCode: req.body.refferalCode}).then(user=>{
        if(user){
          const newUser = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            mobile: req.body.mobile,
            occupation: req.body.occupation,
            gender: req.body.optradio,
            address: req.body.address,
            workAddress: req.body.wordAddress,
            refferalCode: req.body.refferalCode
          });
    
          newUser
          .save()
          .then(user => res.json({user: user, isRefferer: true}))
          .catch(err => console.log(err));
        }
        const newUser = new User({
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          mobile: req.body.mobile,
          occupation: req.body.occupation,
          gender: req.body.optradio,
          address: req.body.address,
          workAddress: req.body.wordAddress,
          refferalCode: req.body.refferalCode
        });
  
        newUser
        .save()
        .then(user => res.json({user, isRefferer: false}))
        .catch(err => console.log(err));
   
      })
     
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    console.log("exist");
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

router.post("/update-password/:user_id", (req, res) => {
  let new_password = req.body.new_password;
  let confirm_password = req.body.confirm_password;
  let userId = req.params.user_id;

  const { errors, isValid } = validateUpdateInput(req.body);

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(new_password, salt, (err, hash) => {
      if (err) throw err;
      new_password = hash;
      User.findByIdAndUpdate(userId, { password: new_password })
        .then(user => {
          if (!user) {
            errors.email = "User not found";
            return res.status(404).json({ errors: errors, status_code: 422 });
          } else {
            return res.json({ mesg: "password updated", status_code: 200 });
            // console.log('password updated');
            // if(new_password===confirm_password){
            //   bcrypt.genSalt(10, (err, salt) => {
            //   bcrypt.hash(new_password, salt, (err, hash) => {
            //     if (err) throw err;
            //     new_password = hash;

            //   });
            // });
            // return res.status(200).json({mesg: "password udpated"});

            // } else {
            //   return res.status(400).json({mesg: "password does not matched!",status_code:422});
            // }
          }
        })
        .catch(err => {
          return res.status(500).json(err);
        });
    });
  });
});

router.post("/forgot-password", (req, res) => {
  let email = req.body.email;
  const { errors, isValid } = validateForgotInput(req.body);
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com", // Gmail Host
      port: 465, // Port
      secure: true, // this is true as port is 465
      auth: {
        user: "ahafiz167@gmail.com", //Gmail username
        pass: "hadiil!php" // Gmail password
      }
    });

    let mailOptions = {
      from: '"BNJI" <ahafiz167@gmail.com>',
      to: email, // Recepient email address. Multiple emails can send separated by commas
      subject: "Password Reset Request",
      text: "please click the following link to update password!"
    };

    User.findOne({ email }).then(user => {
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json({ errors: errors, status_code: 422 });
      } else {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(500)
              .json({ status_code: 500, mesg: "internal server error!" });
          }

          return res.status(200).json({
            status_code: 200,
            mesg: "email has been sent!",
            user: user._id
          });
        });
      }
    });
  });
});

router.post("/forgot-password-number", (req, res) => {
  let number = req.body.username;
  if (number != null) {
    return res.status(200).json({
      mesg: "code has been sent",
      code: "0000",
      status_code: 200
    });
  } else {
    return res.status(500).json({
      mesg: "number is not valid",
      status_code: 500
    });
  }
});

router.post("/code-verification", (req, res) => {
  let code = req.body.code;
  if (code != null) {
    if (code === "0000") {
      return res.status(200).json({
        mesg: "code has been verified",
        status_code: 200
      });
    }
  } else {
    return res.status(500).json({
      mesg: "code is not valid",
      status_code: 500
    });
  }
});
router.get("/all-users", (req, res) => {
  
User.find({}).then(user=>{
return res.status(200).json({users: user})
}).catch(err=>{

})

});
// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
