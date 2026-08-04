const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

//Create a new Order (From user's Cart)
exports.createOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, paymentMethod, shippingPrice = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Optionally clear the user's cart after placing the order
    await Cart.findOneAndUpdate({ user }, { items: [], totalPrice: 0 });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Get all Order (Admin)
exports.getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get single Order by Id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update Order Status  (e.g. 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updateData = { orderStatus };
    if (orderStatus === 'delivered') updateData.deliveredAt = Date.now();

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Delete an Order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};