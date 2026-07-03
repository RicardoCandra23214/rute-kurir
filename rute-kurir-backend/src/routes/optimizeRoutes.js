const express = require("express");
const { optimizeRoute } = require("../controllers/optimizeController");

const router = express.Router();

router.get("/:userId", optimizeRoute);

module.exports = router;