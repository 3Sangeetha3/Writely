const { check, validationResult } = require("express-validator");

exports.registerValidationRules = [
  check("user.username")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("user.email").isEmail().withMessage("Invalid email format"),
  check("user.password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>_]/).withMessage("Password must contain at least one special character"),
];

exports.loginValidationRules = [
  check("user.email").isEmail().withMessage("Invalid email format"),
  check("user.password").notEmpty().withMessage("Password is required"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
