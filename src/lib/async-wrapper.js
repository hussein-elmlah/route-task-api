const asyncWrapper = (promise) => promise
  .then((data) => [undefined, data])
  .catch((error) => [error]);

module.exports = asyncWrapper;
