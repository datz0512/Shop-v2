import express from 'express';

import {
	addOrderItems,
	getMyOrder,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDeliver,
	getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrder);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDeliver);

export default router;
