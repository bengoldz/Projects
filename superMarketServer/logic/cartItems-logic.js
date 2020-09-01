const cartItemsDao = require("../dao/cartItems-dao");

async function addItemToCart(product_id, amount, cartId, userId) {
  // product_price, product_id, amount

  await cartItemsDao.checkAmountField(product_id, amount, cartId, userId);
}

async function updateShoppingCartTotalPrice(cartId, userId) {
  await cartItemsDao.updateShoppingCartTotalPrice(cartId, userId);
}
module.exports = {
  addItemToCart,
  updateShoppingCartTotalPrice,
};
