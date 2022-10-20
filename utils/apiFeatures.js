class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeField = ["page", "sort", "limit", "filed"];
    excludeField.forEach((el) => delete queryObj[el]);
    // Advance Filtering
    this.queryString = JSON.stringify(queryObj);
    this.queryString = this.queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.queryString = JSON.parse(this.queryString);
    this.query = this.query.find(this.queryString);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(",").join(" ");
      this.query.sort(sortby);
    } else {
      this.query.sort("-price");
    }
    return this;
  }
  limitField() {
    if (this.queryString.fields) {
      const limitTo = this.queryString.fields.split(",").join(" ");
      this.query.select(limitTo);
    } else {
      this.query.select("-__v");
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
