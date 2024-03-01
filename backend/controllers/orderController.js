import asyncHandler from '../middlewares/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res, next) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
	} else {
		const order = new Order({
			user: req.user._id,
			orderItems: orderItems.map(x => ({
				...x,
				product: x._id,
				_id: undefined,
			})),
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		});
		const createdOrder = await order.save();

		res.status(201).json(createdOrder);
	}
});

// @desc    Get loggedIn user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrder = asyncHandler(async (req, res, next) => {
	const orders = await Order.find({ user: req.user._id });
	res.status(200).json(orders);
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);

	if (order) {
		res.status(200).json(order);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
	res.send('update order to paid');
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDeliver = asyncHandler(async (req, res, next) => {
	res.send('update order to deliver');
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res, next) => {
	res.send('get all orders');
});

export {
	addOrderItems,
	getMyOrder,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDeliver,
	getOrders,
};
