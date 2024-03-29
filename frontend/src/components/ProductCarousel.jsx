import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
	const { data: products, error, isLoading } = useGetTopProductsQuery();

	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<div style={{ display: 'block', width: '100%', padding: 30 }}>
			<Carousel pause='hover' className='bg-dark'>
				{products.map(product => (
					<Carousel.Item key={product._id} style={{ textAlign: 'center' }}>
						<Link to={`/product/${product._id}`} className='d-block w-100'>
							<Image
								src={product.image}
								alt={product.name}
								width={400}
								height={170}
								fluid
								objectFit='cover'
							/>
							<Carousel.Caption className='carousel-caption'>
								<h2>
									{product.name} (${product.price})
								</h2>
							</Carousel.Caption>
						</Link>
					</Carousel.Item>
				))}
			</Carousel>
		</div>
	);
};

export default ProductCarousel;
