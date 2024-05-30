const Order = require('../models/Order');
const User = require('../models/User');

// Create an Order
const createOrder = async (req, res) => {
    const order = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newOrder = new Order({...order, createdAt: new Date().toISOString()});

        const savedOrder = await newOrder.save();
        res.status(201).json({ order: savedOrder, message: 'Order created!' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};


// Fetch a particular order by the user
const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('user').populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};


// Get all orders by the user
const getAllOrders = async (req, res) => {
    try {
        const order = await Order.find().populate('user').populate('items.product');
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};


// Edit user's order based on only the fact that the status of the order is still at 'Pending'
const editOrder = async (req, res) => {
    const { id } = req.params;
    const { items, totalAmount } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be edited as it is not pending' });
        }

        order.items = items;
        order.totalAmount = totalAmount;
        const updatedOrder = await order.save();

        res.status(200).json({ order: updatedOrder, message: 'Order updated successfully!' });
    }catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};


// Update the status of an order
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const {status } = req.body

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Order does not exist' });

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ order: updatedOrder, message: 'Order status updated!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};


// Delete an order based on only the fact that the status of the order is still at 'Pending'
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be deleted as it is not pending' });
        }

        const deletedOrder = await Order.findByIdAndRemove(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};


module.exports = { createOrder, getOrder, getAllOrders, editOrder, updateOrderStatus, deleteOrder };
