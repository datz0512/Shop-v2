import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

const Footer = () => {
	return (
		<MDBFooter className='bg-dark'>
			<div className='text-white text-center p-5'>
				© 2024 Copyright:
				<a className='text-white' href='/'>
					DatzShop
				</a>
			</div>
		</MDBFooter>
	);
};

export default Footer;