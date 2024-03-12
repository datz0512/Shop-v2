import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
	return (
		pages > 1 && (
			<div
				style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}
			>
				<Pagination>
					{[...Array(pages).keys()].map(x => (
						<LinkContainer
							key={x + 1}
							to={
								!isAdmin
									? keyword
										? `/search/${keyword}/page/${x + 1}`
										: `/page/${x + 1}`
									: `/admin/productlist/${x + 1}`
							}
						>
							<Pagination.Item
								style={{ borderColor: 'black' }}
								active={x + 1 === page}
							>
								{x + 1}
							</Pagination.Item>
						</LinkContainer>
					))}
				</Pagination>
			</div>
		)
	);
};

export default Paginate;
