const cartItemsLogic = require("../logic/cartItems-logic");
const express = require("express");
let cacheModule = require("../dao/cache-module");
const { request, response } = require("express");

const router = express.Router();

router.post("/addToCart", async (request, response, next) => {
  let cartItem = request.body;
  let authorizationString = request.headers["authorization"];
  let token = authorizationString.substring("Bearer ".length);

  let userData = cacheModule.get(token);

  console.log(userData);
  let cartId = userData.cart_id;
  let userId = userData.user_id;
  // console.log(cartId);
  try {
    await cartItemsLogic.addItemToCart(
      cartItem.product_id,
      cartItem.amount,
      cartId,
      userId
    );
    await cartItemsLogic.updateShoppingCartTotalPrice(cartId, userId);
    response.json();
  } catch (err) {
    console.error(err);
    response.status(600).send(error.message);
  }
});

module.exports = router;
