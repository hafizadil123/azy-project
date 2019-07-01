const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateUpdateInput(data) {
  let errors = {};

  data.new_password = !isEmpty(data.new_password) ? data.new_password : "";
  data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : "";

  if (!Validator.isEmpty(data.new_password)) {
    errors.new_password = "New password is required";
  }
  if (!Validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = "confirm password is required";
  }

  if(data.new_password!=data.confirm_password){
      errors.new_password = "password does not matched!";
  }

 

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
