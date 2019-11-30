const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

//@desc     Get all medicines
//@route    Get /api/v1/orders
//@access   Private
router.get('/:userEmail', async(req, res) =>{
    const {userEmail} = req.params;
    let orders = await Order.find({userEmail});
    res.status(200).json(orders);
})
// We export the router so that the server.js file can pick it up
module.exports = router;
