import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import Messase from '../components/Message';
import Loader from '../components/Loader';
import {
	useGetOrderDetailsQuery,
	usePayOrderMutation,
	useGetPaypalClientIdQuery,
	useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import Meta from '../components/Meta';

const OrderScreen = () => {
	const { id: orderId } = useParams();

	const {
		data: order,
		refetch,
		isLoading,
		error,
	} = useGetOrderDetailsQuery(orderId);

	const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

	const [deliverOrder, { isLoading: loadingDeliver }] =
		useDeliverOrderMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: loadingPaypal,
		error: errorPaypal,
	} = useGetPaypalClientIdQuery();

	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		if (!errorPaypal && !loadingPaypal && paypal.clientId) {
			const loadPayPalScript = async () => {
				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': paypal.clientId,
						currency: 'USD',
					},
				});
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			};
			if (order && !order.isPaid && !order.isDelivered) {
				if (!window.paypal) {
					loadPayPalScript();
				}
			}
		}
	}, [order, paypal, paypalDispatch, errorPaypal, loadingPaypal]);

	const onApprove = async (data, actions) => {
		return actions.order.capture().then(async details => {
			try {
				await payOrder({
					orderId: order._id,
					details,
				}).unwrap();
				toast.success('Payment successful');
				refetch();
			} catch (err) {
				toast.error(err?.data?.message || err.message);
			}
		});
	};

	// const onApproveTest = async () => {
	// 	await payOrder({
	// 		orderId: order._id,
	// 		details: { payer: {} },
	// 	});
	// 	toast.success('Payment successful');
	// 	refetch();
	// };

	const onError = err => {
		toast.error(err?.data?.message || err.message);
	};

	const createOrder = (data, actions) => {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: {
							value: order.totalPrice,
						},
					},
				],
			})
			.then(orderID => {
				return orderID;
			});
	};

	const deliverOrderHandler = async () => {
		try {
			await deliverOrder(order._id);
			toast.success('Order delivered');
			refetch();
		} catch (err) {
			toast.error(err?.data?.message || err.message);
		}
	};

	return isLoading ? (
		<Loader />
	) : error ? (
		<Messase variant='danger'>{error?.data?.message || error.error}</Messase>
	) : (
		<>
			<Meta title={`Order`} />
			<h1>Order #{order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city},{' '}
								{order.shippingAddress.postalCode},{' '}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Messase variant='success'>
									Delivered on {order.deliveredAt}
								</Messase>
							) : (
								<Messase variant='danger'>Not Delivered</Messase>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Messase variant='success'>Paid on {order.paidAt}</Messase>
							) : (
								<Messase variant='danger'>Not Paid</Messase>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Messase>Your order is empty</Messase>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>

							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{isPending ? (
										<Loader />
									) : (
										<div>
											{/* <Button
												onClick={onApproveTest}
												style={{ marginBottom: '10px' }}
											>
												Pay Order
											</Button> */}
											<div>
												<PayPalButtons
													createOrder={createOrder}
													onApprove={onApprove}
													onError={onError}
												></PayPalButtons>
											</div>
										</div>
									)}
								</ListGroup.Item>
							)}

							{loadingDeliver && <Loader />}
							{userInfo &&
								userInfo.isAdmin &&
								order.isPaid &&
								!order.isDelivered && (
									<ListGroup.Item>
										<Button
											type='button'
											className='btn btn-block'
											onClick={deliverOrderHandler}
										>
											Mark as Delivered
										</Button>
									</ListGroup.Item>
								)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
