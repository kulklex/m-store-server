const Order = require('../models/Order');
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
    const { user, items, totalAmount } = req.body;

    try {
        const newOrder = new Order({ user, items, totalAmount });
        const savedOrder = await newOrder.save();
        res.status(201).json({ order: savedOrder, message: 'Order created!' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Order does not exist' });

        const order = await Order.findById(id).populate('user').populate('items.product');
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error getting order', error });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Order does not exist' });

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ order: updatedOrder, message: 'Order status updated!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Order does not exist' });

        await Order.findByIdAndRemove(id);
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};


module.exports = { createOrder, getOrder, getAllOrders, updateOrderStatus, deleteOrder };
