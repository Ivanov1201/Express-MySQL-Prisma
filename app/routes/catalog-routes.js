const express = require("express");
const router = express.Router();
const catalog_controller = require("../controllers/catalog-controller");

router.post("/catalog", catalog_controller.getCatalog);

module.exports = router;
