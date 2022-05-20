const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/product-controller");

router.post("/buyProduct", product_controller.buyProduct);

module.exports = router;
