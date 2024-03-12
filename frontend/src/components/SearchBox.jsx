import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
	const navigate = useNavigate();
	const { keyword: urlKeyword } = useParams();
	const [keyword, setKeyword] = useState(urlKeyword || '');

	const submitHandler = e => {
		e.preventDefault();
		if (keyword.trim()) {
			navigate(`/search/${keyword}`);
			setKeyword('');
		} else {
			navigate('/');
		}
	};

	return (
		<Form onSubmit={submitHandler} className='d-flex'>
			<Form.Control
				icon={<FaSearch />}
				type='text'
				name='q'
				onChange={e => setKeyword(e.target.value)}
				value={keyword}
				placeholder='Search Products...'
				className='mr-sm-2 ml-sm-5'
				style={{ width: '30rem', height: '2.5rem' }}
			></Form.Control>
			<Button
				type='submit'
				variant='outline-light'
				className='p-2 mx-1'
				style={{ height: '2.5rem' }}
			>
				<FaSearch fontSize={20} className='pb-1' />
			</Button>
		</Form>
	);
};

export default SearchBox;
