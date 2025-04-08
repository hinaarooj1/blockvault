// It is an alternate of try catch we can use it instead of try cacth to handle catch block error
module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
