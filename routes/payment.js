const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

const Insta = require("instamojo-nodejs");
const url = require("url");

// /api/v1/payment/pay
router.post("/pay", async(req, res) => {
  Insta.setKeys(
    "test_7bc09206a269adbb862311bb49a",
    "test_b47b41d4eb3edeaf64c904dc7e5"
  );

  const data = new Insta.PaymentData();
  Insta.isSandboxMode(true);

  data.purpose = req.body.purpose;
  data.amount = req.body.amount;
  data.buyer_name = req.body.buyer_name;
  data.redirect_url = req.body.redirect_url;
  data.email = req.body.email;
  data.phone = req.body.phone;
  data.send_email = true;
  data.webhook = "http://www.example.com/webhook/";
  data.send_sms = true;
  data.allow_repeated_payments = false;

  //save order to order table with products details
  let newOrder = {
    purpose:data.purpose,
    userEmail:data.email,
    items:req.body.items,
    amount:data.amount,
    deliveryLocation:req.body.deliveryLocation,
    delivery:'Under 5 Days',
    payment:'pending',
  };

  let orderResponse = await Order.create(newOrder);

  // console.log(orderResponse);
  data.redirect_url += `&order_id=${orderResponse._id}`;

  Insta.createPayment(data, function(error, response) {
    if (error) {
      // some error
    } else {

      //save order to
      // Payment redirection link at response.payment_request.longurl
      const responseData = JSON.parse(response);
      const redirectUrl = responseData.payment_request.longurl;
      res.status(200).json(redirectUrl);
    }
  });
});

/**
 * @route GET /api/v1/payment/callback/
 * @desc Call back url for instamojo
 * @access public
 */
router.get("/callback/", async(req, res) => {
  let url_parts = url.parse(req.url, true),
    responseData = url_parts.query;

  // console.log(responseData)
  if (responseData.payment_id && responseData.payment_request_id) {
    //successfull payment

    //update the order payment status
    let updateOrder = {
      payment:'completed',
    };

    await Order.findOneAndUpdate({_id:responseData.order_id}, updateOrder,{
      new: true,
      runValidators: true
    })


    //testing
    Insta.getPaymentDetails(responseData.payment_request_id, responseData.payment_id,async function(error, response) {
      if (error) {
        // Some error
      } else {
        // console.log("getting paymentDetails",response);
      // save payment details
      let newPayment = {
        payment_id: response.payment_request.payment.payment_id,
        status: response.payment_request.status,
        amount: response.payment_request.payment.amount,
        userEmail: response.payment_request.payment.buyer_email,
        created_at: response.payment_request.payment.created_at,
        billing_instrument: response.payment_request.payment.billing_instrument,
        userId: responseData.user_id
      };

      await Payment.create(newPayment);

      }
    });


    // Redirect the user to payment complete page.
    return res.redirect("http://localhost:3000/payment-complete");
  }
});

// We export the router so that the server.js file can pick it up
module.exports = router;
