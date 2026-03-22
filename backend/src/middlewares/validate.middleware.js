import MESSAGES from "../constants/messages.js";

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });

    if (!error) return next();

    const errors = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message.replace(/['"]/g, ""),
    }));

    return res.status(422).json({
      success: false,
      message: MESSAGES.VALIDATION.FAILED,
      errors,
    });
  };
};

export default validate;
