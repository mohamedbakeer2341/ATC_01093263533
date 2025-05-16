// backend/src/utils/pagination.js
export const paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 10));
  const skip = (page - 1) * limit;

  const total = await model.countDocuments(query);

  let queryBuilder = model.find(query).skip(skip).limit(limit);

  if (options.populate) {
    queryBuilder = queryBuilder.populate(options.populate);
  }

  if (options.sort) {
    queryBuilder = queryBuilder.sort(options.sort);
  }

  const data = await queryBuilder.lean().exec();

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

export default paginate;
