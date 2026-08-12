const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

//Create a new Order (From user's Cart)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, shippingPrice = 0 } = req.body;
    const user = req.user._id; // always the logged-in user, never trust a client-supplied ID

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

//Get all Orders — admins see everything (optionally filtered by ?user=),
//customers only ever see their own orders regardless of what ?user= says
exports.getOrders = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'admin') {
      if (req.query.user) filter.user = req.query.user;
    } else {
      filter.user = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get single Order by Id — owner or admin only
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update Order Status
//- Admins can set any status (pending, processing, shipped, delivered, cancelled)
//- The order's owner can only cancel it, and only while it's still pending/processing
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    if (!isAdmin) {
      // Non-admin owners may only cancel, and only from an early state
      const cancellableStates = ['pending', 'processing'];
      if (orderStatus !== 'cancelled' || !cancellableStates.includes(order.orderStatus)) {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel an order while it is still pending or processing',
        });
      }
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered') order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Delete an Order (admin only — enforced at the route level)
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