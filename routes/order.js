const express = require('express');
const { createOrder, getOrder, getAllOrders, updateOrderStatus, deleteOrder, editOrder } = require('../controllers/order');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');



router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrder);
router.put('/:id', verifyToken, editOrder);
router.put('/:id', verifyToken, updateOrderStatus);
router.delete('/:id', verifyToken, deleteOrder);



module.exports = router;
