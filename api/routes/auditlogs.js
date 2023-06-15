const express = require("express");
const moment = require("moment");
const router = express.Router();
const Response = require("../lib/Response");
const AuditLogs = require("../db/models/AuditLogs")


router.post("/", async (req, res) => {
    try {
      let body = req.body;
      let query = {};
      let skip = body.skip;
      let limit = body.limit;
  
      if (typeof body.skip !== "number") {
        skip = 0;
      }
      if (typeof body.limit !== "number" || body.limit > 500) {
        limit = 500;
      }
  
      if (body.begin_date && body.end_date) {
        query.created_at = {
          $gte: moment(body.begin_date).toDate(),
          $lte: moment(body.end_date).toDate(),
        };
      } else {
        query.created_at = {
          $gte: moment().subtract(1, "day").startOf("day").toDate(),
          $lte: moment().toDate(),
        };
      }
  
      let auditLogs = await AuditLogs.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
  
      res.json(Response.successResponse(auditLogs));
    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
  });

module.exports = router;
