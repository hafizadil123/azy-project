const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  console.log('fffff', data);
  data.fname = !isEmpty(data.fname) ? data.fname : '';
  data.lname = !isEmpty(data.lname) ? data.lname : '';
  if (!Validator.isLength(data.fname, { min: 2, max: 30 })) {
    errors.fname = 'First Name and last name between 2 to 30 charecter';
  }

  if (Validator.isEmpty(data.fname)) {
    errors.fname = 'fname field is required';
  }

  

  if (Validator.isEmpty(data.lname)) {
    errors.lname = 'last name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
