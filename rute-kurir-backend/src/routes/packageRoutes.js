const express = require("express");

const router = express.Router();

const {
  createPackage,
  getPackages,
  deletePackage,
  updatePackage,
} = require("../controllers/packageController");

// CREATE
router.post("/packages", createPackage);

// GET
router.get("/packages/:user_id", getPackages);

// DELETE
router.delete("/packages/:id", deletePackage);

// UPDATE
router.put("/packages/:id", updatePackage);

module.exports = router;