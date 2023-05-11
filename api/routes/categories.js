var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");

/*GET categories */
router.get("/", async (req, res, next) => {
  try {
    let categories = await Categories.find({});
    res.json(Response.successResponse(categories));
  } catch (error) {
    let errorResponse = Response.errorResponse(err)
    res.status(errorResponse.code).json(errorResponse)
  }
});

//POST CATEGORIES
router.post("/add", async (req, res) => {
  let body = req.body
  try {
    if(!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","name field must be filled")
    let cateory = new Categories({
      name:body.name,
      is_active:true,
      created_by:req.user?.id
    });

    await cateory.save();

    res.json(Response.successResponse({success:true}))

  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
})

module.exports = router;
