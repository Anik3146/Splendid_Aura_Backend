const express = require("express");
const router = express.Router();

const { createCloud } = require("../controller/cloud.controller");

router.post("/add",createCloud);

module.exports = router;
