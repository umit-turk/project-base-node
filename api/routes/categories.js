var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require("../lib/AuditLogs");
const logger = require("../lib/logger/LoggerClass");

/*GET categories */
router.get("/", async (req, res, next) => {
  try {
    let categories = await Categories.find({});
    res.json(Response.successResponse(categories));
  } catch (error) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

//POST CATEGORIES
router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    if (!body.name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "name field must be filled"
      );
    let cateory = new Categories({
      name: body.name,
      is_active: true,
      created_by: req.user?.id,
    });

    await cateory.save();
    AuditLogs.info(req.user?.email, "Categories", "Add", cateory);
    logger.info(req.user?.email, "Categories","Add",cateory);

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    logger.error(req.user?.email, "Categories","Add",err);
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

//UPDATE CATEGORIES
router.put("/update", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "_id field must be filled"
      );
    let updates = {};

    if (body.name) updates.name = body.name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    await Categories.updateOne({ _id: body._id }, updates);
    res.json(Response.successResponse({ success: true }));
    AuditLogs.info(req.user?.email, "Categories", "Update", {
      _id: body._id,
      ...updates,
    });
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

//DELETE CATEGORIE
router.delete("/delete", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "_id field must be filled"
      );
    await Categories.deleteOne({ _id: body._id });
    res.json(Response.successResponse({ success: true }));
    AuditLogs.info(req.user?.email, "Categories", "Delete", { _id: body._id });
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
