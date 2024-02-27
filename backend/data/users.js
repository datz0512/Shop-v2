import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin',
		email: 'admin@email.com',
		password: bcrypt.hashSync('12345', 10),
		isAdmin: true,
	},
	{
		name: 'Ha Nhat Huy',
		email: 'huybucu@email.com',
		password: bcrypt.hashSync('12345', 10),
		isAdmin: false,
	},
	{
		name: 'Tom Riu',
		email: 'tomriu@email.com',
		password: bcrypt.hashSync('12345', 10),
		isAdmin: false,
	},
];

export default users;
