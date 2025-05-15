const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return next(new Error(errors.join(", "), { status: 400 }));
    }
    next();
  };
};

export default validate;
