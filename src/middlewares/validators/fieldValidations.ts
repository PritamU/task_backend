import { body, param, query } from "express-validator";

type sources = "body" | "query" | "param";

const stringValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isString()
          .withMessage(`${text} must be String`)
          .trim();
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isString()
        .withMessage(`${text} must be String`)
        .trim();

    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isString()
          .withMessage(`${text} must be String`)
          .trim();
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isString()
        .withMessage(`${text} must be String`)
        .trim();
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isString()
          .withMessage(`${text} must be String`)
          .trim();
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isString()
        .withMessage(`${text} must be String`)
        .trim();
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const intValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isInt()
          .withMessage(`${text} must be Integer`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isInt()
        .withMessage(`${text} must be Integer`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isInt()
          .withMessage(`${text} must be Integer`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isInt()
        .withMessage(`${text} must be Integer`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isInt()
          .withMessage(`${text} must be Integer`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isInt()
        .withMessage(`${text} must be Integer`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const floatValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isFloat()
          .withMessage(`${text} must be Float`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isFloat()
        .withMessage(`${text} must be Float`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isFloat()
          .withMessage(`${text} must be Float`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isFloat()
        .withMessage(`${text} must be Float`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isFloat()
          .withMessage(`${text} must be Float`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isFloat()
        .withMessage(`${text} must be Float`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const emailValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isEmail()
          .withMessage(`${text} must be Email`)
          .trim()
          .toLowerCase();
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isEmail()
        .withMessage(`${text} must be Email`)
        .trim()
        .toLowerCase();
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isEmail()
          .withMessage(`${text} must be Email`)
          .trim()
          .toLowerCase();
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isEmail()
        .withMessage(`${text} must be Email`)
        .trim()
        .toLowerCase();
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isEmail()
          .withMessage(`${text} must be Email`)
          .trim()
          .toLowerCase();
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isEmail()
        .withMessage(`${text} must be Email`)
        .trim()
        .toLowerCase();
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const passwordValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isStrongPassword()
          .withMessage(
            `${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`
          )
          .trim();
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isStrongPassword()
        .withMessage(
          `${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`
        )
        .trim();
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isStrongPassword()
          .withMessage(
            `${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`
          )
          .trim();
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isStrongPassword()
        .withMessage(
          `${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`
        )
        .trim();
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isStrongPassword()
          .withMessage(
            `${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`
          )
          .trim();
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isStrongPassword()
        .withMessage(
          `${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`
        )
        .trim();
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};
const passwordValidateWithSimpleMessage = (
  source: sources,
  text: string,
  optional: boolean
) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isStrongPassword()
          .withMessage(`${text} format invalid!`)
          .trim();
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} format invalid!`)
        .bail()
        .isStrongPassword()
        .withMessage(`${text} format invalid!`)
        .trim();
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isStrongPassword()
          .withMessage(`${text} format invalid!`)
          .trim();
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isStrongPassword()
        .withMessage(`${text} format invalid!`)
        .trim();
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isStrongPassword()
          .withMessage(`${text} format invalid!`)
          .trim();
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isStrongPassword()
        .withMessage(`${text} format invalid!`)
        .trim();
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const mongoIdValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text).optional().isMongoId().withMessage(`Invalid ${text}`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isMongoId()
        .withMessage(`Invalid ${text}`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isMongoId()
          .withMessage(`Invalid ${text}`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isMongoId()
        .withMessage(`Invalid ${text}`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isMongoId()
          .withMessage(`Invalid ${text}`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isMongoId()
        .withMessage(`Invalid ${text}`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const enumValidate = (
  source: sources,
  text: string,
  optional: boolean,
  array: Array<string | number>
) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isIn(array)
          .withMessage(`Invalid ${text}`)
          .trim();
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isIn(array)
        .withMessage(`Invalid ${text}`)
        .trim();
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isIn(array)
          .withMessage(`Invalid ${text}`)
          .trim();
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isIn(array)
        .withMessage(`Invalid ${text}`)
        .trim();
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isIn(array)
          .withMessage(`Invalid ${text}`)
          .trim();
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isIn(array)
        .withMessage(`Invalid ${text}`)
        .trim();
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const booleanValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text).optional().isBoolean().withMessage(`Invalid ${text}`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isBoolean()
        .withMessage(`Invalid ${text}`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isBoolean()
          .withMessage(`Invalid ${text}`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isBoolean()
        .withMessage(`Invalid ${text}`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isBoolean()
          .withMessage(`Invalid ${text}`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isBoolean()
        .withMessage(`Invalid ${text}`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const arrayValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isArray()
          .withMessage(`${text} must be an array`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isArray()
        .withMessage(`${text} must be an array`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isArray()
          .withMessage(`${text} must be an array`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isArray()
        .withMessage(`${text} must be an array`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isArray()
          .withMessage(`${text} must be an array`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isArray()
        .withMessage(`${text} must be an array`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const objectValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isObject()
          .withMessage(`${text} must be an object`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isObject()
        .withMessage(`${text} must be an object`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isObject()
          .withMessage(`${text} must be an object`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isObject()
        .withMessage(`${text} must be an object`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isObject()
          .withMessage(`${text} must be an object`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isObject()
        .withMessage(`${text} must be an object`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const phoneValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isLength({ min: 10, max: 10 })
          .withMessage(`${text} must be a 10 digit number!`)
          .isNumeric()
          .withMessage(`${text} must be numeric!`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isLength({ min: 10, max: 10 })
        .withMessage(`${text} must be a 10 digit number!`)
        .isNumeric()
        .withMessage(`${text} must be numeric!`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isLength({ min: 10, max: 10 })
          .withMessage(`${text} must be a 10 digit number!`)
          .isNumeric()
          .withMessage(`${text} must be numeric!`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isLength({ min: 10, max: 10 })
        .withMessage(`${text} must be a 10 digit number!`)
        .isNumeric()
        .withMessage(`${text} must be numeric!`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isLength({ min: 10, max: 10 })
          .withMessage(`${text} must be a 10 digit number!`)
          .isNumeric()
          .withMessage(`${text} must be numeric!`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isLength({ min: 10, max: 10 })
        .withMessage(`${text} must be a 10 digit number!`)
        .isNumeric()
        .withMessage(`${text} must be numeric!`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

const pincodeValidate = (source: sources, text: string, optional: boolean) => {
  switch (source) {
    case "body":
      if (optional) {
        return body(text)
          .optional()
          .isLength({ min: 6, max: 6 })
          .withMessage(`${text} must be a 6 digit number!`)
          .isNumeric()
          .withMessage(`${text} must be numeric!`);
      }
      return body(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage(`${text} must be a 6 digit number!`)
        .isNumeric()
        .withMessage(`${text} must be numeric!`);
    case "query":
      if (optional) {
        return query(text)
          .optional()
          .isLength({ min: 6, max: 6 })
          .withMessage(`${text} must be a 6 digit number!`)
          .isNumeric()
          .withMessage(`${text} must be numeric!`);
      }
      return query(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage(`${text} must be a 6 digit number!`)
        .isNumeric()
        .withMessage(`${text} must be numeric!`);
    case "param":
      if (optional) {
        return param(text)
          .optional()
          .isLength({ min: 6, max: 6 })
          .withMessage(`${text} must be a 6 digit number!`)
          .isNumeric()
          .withMessage(`${text} must be numeric!`);
      }
      return param(text)
        .notEmpty()
        .withMessage(`${text} Required`)
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage(`${text} must be a 6 digit number!`)
        .isNumeric()
        .withMessage(`${text} must be numeric!`);
    default:
      console.log(`Default validator case for ${text} in ${source}`);
  }
};

export {
  arrayValidate,
  booleanValidate,
  emailValidate,
  enumValidate,
  floatValidate,
  intValidate,
  mongoIdValidate,
  objectValidate,
  passwordValidate,
  passwordValidateWithSimpleMessage,
  phoneValidate,
  pincodeValidate,
  stringValidate,
};
