const express = require('express');
const { createOrder, getOrder, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/order');
const router = express.Router();



router.post('/', createOrder);
router.get('/:id', getOrder);
router.get('/', getAllOrders);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);




module.exports = router;
