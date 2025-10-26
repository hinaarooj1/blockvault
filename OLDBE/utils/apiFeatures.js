// We have to use class here to pass nested function to controller
class apiFeatures {
  // It is same as we give parameters in fat arrow function
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // Search filter for searching keywords
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            // regex is a regular expression that selects expressions
            $regex: this.queryStr.keyword,
            // i means cas insensitive
            $options: "i",
          },
        }
      : {};
    // The find method will trigger again with spread operator to find document with keyword
    this.query = this.query.find({ ...keyword });

    return this;
  }
  filter() {
    // Make copy of the queryStr(keywords)
    let queryCopy = { ...this.queryStr };
    // We have to remove other keywords because we already filtering keyword in search in upper function and page
    // and limit is like items per page, we have to remove them also because we will filter it in all items
    let removeKeys = ["keyword", "page", "limit"];

    removeKeys.forEach((key) => delete queryCopy[key]);
    //  We have to add $ with lt and gt beacuse it is used to find less than and greater than price so convert it intp string and replace below
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);
    // Then again convert it into object
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPerPage) {
    // It is used to show results per page, if "this.queryStr.page" isn't there then current page will be 1
    let currentPage = this.queryStr.page || 1;
    //  In skip variable we used math here like we are showing result per page 5,
    //  so if we are on 3rd page then 5 * (3 - 1) = 10 so first 10 will be skipped and page will start from 11th item.
    let skip = resultPerPage * (currentPage - 1);

    // Here are mongodb keyword limit("resultPerPage are 5") it means show only first 5 items.
    // And skip() means skip those items
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = apiFeatures;

// const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// const apiFeatures = catchAsyncErrors(async (query, queryStr) => {
//   this.query = query;
//   this.queryStr = queryStr;
//   search = async () => {
//     const keyword = this.queryStr
//       ? {
//           name: {
//             $regex: this.queryStr.keyword,
//             $options: "i",
//           },
//         }
//       : {};

//     this.query = await this.query.find({ ...keyword });
//     // console.log(querys);
//   };
//   return search();
// });
// module.exports = apiFeatures;
