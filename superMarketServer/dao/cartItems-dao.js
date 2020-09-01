let connection = require("./connection-wrapper");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");
const { request } = require("express");
const cacheModule = require("./cache-module");

async function addItemToCart(product_id, amount, cart_id) {
  let sql =
    "INSERT INTO cart_items SET cart_id = ?, product_id = ?, amount = ?, total_price =  amount * (SELECT unit_price FROM products WHERE id = ?)";
  let parameters = [cart_id, product_id, amount, product_id];
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
  }
}

async function checkAmountField(product_id, amount, cart_id, userId) {
  console.log(product_id, amount, cart_id);
  let sql =
    "SELECT amount FROM shufersal.cart_items where product_id = ? and cart_id=?";
  let parameters = [product_id, cart_id];
  try {
    let amountExists = await connection.executeWithParameters(sql, parameters);

    if (amountExists.length == 0) {
      await addItemToCart(product_id, amount, cart_id);
    } else {
      await updateAmount(product_id, cart_id, userId);
    }
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
  }
}

async function updateAmount(product_id, cart_id, userId) {
  let sql =
    "update cart_items set amount =(amount+ 1), total_price =  amount * (SELECT unit_price FROM products WHERE id = ?) where product_id = ? and cart_id = ?";
  let parameters = [product_id, product_id, cart_id];
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
  }
}

async function updateShoppingCartTotalPrice(cart_id, userId) {
  console.log(userId);
  let sql =
    "UPDATE shopping_cart set totalPrice = (SELECT sum(total_price) FROM cart_items WHERE cart_id =?) WHERE user_id =?";
  let parameters = [cart_id, userId];
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
  }
}

module.exports = {
  addItemToCart,
  updateShoppingCartTotalPrice,
  checkAmountField,
  updateAmount,
};

// get cart_items in login.

// select
// 	product_name ,
//     cart_id
// from
// 	products
// join
// 	cart_items
//     where
//     cart_items.product_id = products.id
