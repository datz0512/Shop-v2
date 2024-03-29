import { Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
	const { pageNumber, keyword } = useParams();

	const { data, isLoading, error } = useGetProductsQuery({
		keyword,
		pageNumber,
	});

	return (
		<>
			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link to='/' className='btn btn-light mb-4'>
					{' '}
					Go Back
				</Link>
			)}
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>
					{error?.data?.message || error.error}
				</Message>
			) : (
				<>
					<Meta title='DatzShop' />
					{keyword ? (
						<h1>
							Search Results for "{keyword}" ({data.products.length} items)
						</h1>
					) : (
						<h1>Latest Products</h1>
					)}

					<Row>
						{data.products.length > 0 ? (
							data.products.map(product => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							))
						) : (
							<p>No products found</p>
						)}
					</Row>
					<Paginate
						pages={data.pages}
						page={data.page}
						isAdmin={false}
						keyword={keyword || ''}
					/>
				</>
			)}
		</>
	);
};

export default HomeScreen;
