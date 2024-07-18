const CustomError = require("../lib/customError.js");
const Category = require("../models/Category.js");

exports.handleQueryParams = async function(model, queryParams, defaultSearchField) {
  const {
    page = 1,
    limit = 10,
    order,
    search,
    user,
    category,
    shared,
    searchField,
    ...filters
  } = queryParams;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const maxLimit = 101;

  if (parsedPage < 1 || parsedLimit < 1 || parsedLimit > maxLimit) {
    throw new CustomError("Invalid pagination parameters", 400);
  }

  let filterConditions = {};

  if (search && effectiveSearchField) {
    const searchRegex = new RegExp(search, "i");
    filterConditions[effectiveSearchField] = { $regex: searchRegex };
  }
  if (search && !effectiveSearchField) {
    throw new CustomError("Invalid search parameters", 400);
  }

  Object.keys(filters).forEach((param) => {
    filterConditions[param] = { $regex: new RegExp(filters[param], "i") };
  });

  if (user) {
    filterConditions.user = user;
  }

  if (category) {
    const categoryDocs = await Category.find({ name: new RegExp(`^${category}$`, "i") });
    if (categoryDocs.length === 0) {
      throw new CustomError("Category not found", 404);
    }
    const categoryIds = categoryDocs.map(doc => doc._id);
    filterConditions.category = { $in: categoryIds };
  }

  // boolean conversion
  if (shared) {
    filterConditions.shared = shared === 'true' || shared === '1' ? true : shared === 'false' || shared === '0' ? false : undefined;
  }

  const startIndex = (parsedPage - 1) * parsedLimit;

  let query = model.find(filterConditions);

  if (order) {
    const sortOrder = order.startsWith("-") ? -1 : 1;
    const field = order.replace(/^-/, "");

    if (Object.keys(model.schema.paths).includes(field) || field.includes(".")) {
      const sortObject = {};
      sortObject[field] = sortOrder;
      query = query.sort(sortObject);
    } else {
      throw new CustomError("Invalid order field", 400);
    }
  }

  const dataQuery = query.skip(startIndex).limit(parsedLimit);
  const data = await dataQuery;

  const totalCount = await model.countDocuments(filterConditions);
  const totalPages = Math.ceil(totalCount / parsedLimit);

  return {
    data,
    currentPage: parsedPage,
    totalPages,
    totalCount,
  };
};
