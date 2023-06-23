const express = require('express');
// loading the expressjs module into our app and into the express variable
// express module will allow us to use expressjs methods to create out api


// create an application with expressjs this create an express js app and stores it as app
// app is our server
const app = express();
//const bodyParser = require('body-parser');
const port = 4000;

app.use(express.json());
//express.json() allows us to handle the request's body and automatically parse the incoming JSON to a JS object we can access and manage
//app.use(bodyParser.json());

let users = [
		{
			email: "ifonly@email.com",
			password: "regrets",
			isAdmin: false,
			order: []
		},
		{
			email: "admin@email.com",
			password: "admin",
			isAdmin: true,
			order: []
		}
	];

let products = [
{
			"id": 0,
			"name": "iPhone",
			"description": "The first iPhone",
			"price": 10000,
			"isActive": true,
			"createdOn": new Date()
},
{			
			"id": 1,
			"name": "iPhone 2",
			"description": "The second iPhone",
			"price": 10000,
			"isActive": false,
			"createdOn": new Date()
},
{
			"id": 2,
			"name": "iPhone 3",
			"description": "The third iPhone",
			"price": 10000,
			"isActive": true,
			"createdOn": new Date()
}



	];

let loggedUser;


// express has methods to use as routes correesponding to http method
// get(<endpoint>, <functionToHandle request and response>)
app.get('/', (req, res) => {
	// once the route accessed, we can send a response with use of res.send()
	// res.send() actually combines writeHead() and end() already
	// it is used to send a resposne to the client and is the end of the response
	res.send('Hello po!')
});

app.post('/users/register',(req, res) => {
	console.log(req.body);
	// simulate the creation of new user account
	let newUser = {
		email: req.body.email,
		password: req.body.password,
		isAdmin: req.body.isAdmin,
		order: []
	};
	users.push(newUser);
	console.log(users);

	res.send("Registered Successful!" + "\n 200 OK.")
});

//login
app.post('/users/login',(req, res) => {
	// should contain username and paddword
	console.log(req.body);


	// find the user wit hthe same email and apassword from our request body
	let foundUser = users.find((user) => {
		return user.email === req.body.email && user.password === req.body.password;
		});

		if(foundUser !== undefined) {
			// get the index number foundUser, but since the users array is an array of object we have to use findIndex().
			//it will iterate over all of the items and return the index number of the current item that matches the return condition. It is similar to find() but instead it returns only the index number

			let foundUserIndex = users.findIndex((user) => {
				return user.email === foundUser.email
			});
			// This will add the index of your found user in the foundUser object
			foundUser.index === foundUserIndex;
			//temporarily log our user in. Allows us to refer the details of a logged in user
			loggedUser = foundUser;
			console.log(loggedUser);

			res.send('Thank you for logging in. \n 200 OK.');
		} else {
			loggedUser = foundUser;
			console.log(users);
			res.send('Login failed. 401 Wrong credentials.');

		}
})

app.put('/users/admin/:index',(req, res) => {
		console.log(req.params);
		console.log(req.params.index);
		let index = parseInt(req.params.index)

		if(loggedUser.isAdmin === true) {
		users[index].isAdmin = true;
		res.send(`${users[index].email} is now an Administrator. \n 200 OK.`);
	}
		else {
			res.send("403 Unauthorized Request.")
		}
	
});

app.get('/users/all', (req,res) => {
	res.send(users);
});



//products
app.post('/products/add',(req, res) => {
	console.log(loggedUser);
	console.log(req.body);

	if(loggedUser.isAdmin === true) {
		let newProduct = {
			id: products.length + 1,
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			isActive: req.body.isActive,
			createdOn: new Date(),
		};
		products.push(newProduct);
		console.log(products);

		res.send('Admin has added a new item.' + "\n 200 OK.");
	} else {
		res.send("403 Unauthorized Request.");
	}
});

app.get('/products',  (req, res) => {
	console.log(loggedUser)
		console.log(products)
		res.send(products);

});

app.get('/products/active', (req, res) => {
	console.log(loggedUser)
		let activeProducts = products.filter((products) => products.isActive === true);
		res.send(activeProducts);

});

app.get('/products/:index',(req,res) => {
		console.log(req.params);
		console.log(req.params.index);
		let number = parseInt(req.params.index);
		console.log(products[number]);
		res.send(products[number]);
});

app.put('/products/update/:index',(req,res) => {
		console.log(req.params);
		console.log(req.params.index);
		let number = parseInt(req.params.index);
		let editProduct = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price
		}

		if(loggedUser.isAdmin === true) {
			products[number].name = editProduct.name;
			products[number].description = editProduct.description;
			products[number].price =  editProduct.price;
		console.log(products[number]);
		res.send(`${products[number].name} has been updated! \n 200 OK.`);
		
	} else {
		res.send("403 Unauthorized Request.");
	}
});

app.put('/products/archive/:index',(req, res) => {
		console.log(req.params);
		console.log(req.params.index);
		let index = parseInt(req.params.index)

		if(loggedUser.isAdmin === true) {
		products[index].isActive = false;
		res.send(`${products[index].name} is now Archived/Inactive. + \n 200 OK.`);


	}
	else {
			res.send("403 Unauthorized Request.");
		}
});

// orders
app.post('/users/order/add/:index/:id',(req, res) => {
		console.log(req.params);
		let id = parseInt(req.params.id);
		let index = parseInt(req.params.index);

		if(loggedUser.isAdmin === false) {
		let newOrder = {
			userID: loggedUser.email,
			products: products[id].name,
			price: products[id].price,
			purchasedOn: new Date(),
			quantity: req.body.quantity,
			totalQP: req.body.quantity * products[id].price
		};
		loggedUser.order.push(newOrder);
		users[index].order = loggedUser.order;
		console.log(loggedUser.order);
		res.send('You have added an item to your cart. \n 200 OK.');
	}	else{
		res.send("403 Unauthorized Request.")
				console.log(loggedUser);
			}
	

});

app.put('/users/order/quantity/:index',(req,res) => {
	console.log(req.params.index);
	let index = parseInt(req.params.index);
	let quantityedit = parseInt(req.body.quantity);

	loggedUser.order[index].quantity = quantityedit;
	loggedUser.order[index].totalQP = req.body.quantity * loggedUser.order[index].price;
	console.log(loggedUser.order)
	res.send(`${loggedUser.email}'s order of ${loggedUser.order[index].products}'s quantity is now ${quantityedit}. \n 200 OK.`)
})

app.get('/users/order/', (req, res) => {

	if(loggedUser.isAdmin === false) {
		console.log('success');
		res.send(loggedUser.order);
	}
	else {
		res.send("403 Unauthorized Request.")
	}
});

app.delete('/users/order/remove/:index', (req, res) => {

	console.log(req.params.index);
	let index = parseInt(req.params.index);
	let remove = loggedUser.order[index].products;
	loggedUser.order.splice(index, 1);
	console.log(loggedUser.order)
	res.send(`${remove} has been removed from your cart. \n 200 OK.`)
});

app.get('/users/totalorder', (req, res) => {

	if(loggedUser.isAdmin === false) {
		let total = 0;
		for(let i=0;i<loggedUser.order.length;i++) {
			total = loggedUser.order[i].totalQP + total;
		}
		res.send(`Your Total Order Price is ${total} \n 200 OK.`);
		}
		
	else {
		res.send("403 Unauthorized Request.")
	}
});


app.get('/users/allorder', (req, res) => {

	if(loggedUser.isAdmin === true) {
		console.log('all success');
			let allOrder = users.filter((users) => users.isAdmin === false);
			res.send(allOrder)
		}
		
	else {
		res.send("403 Unauthorized Request.")
	}
});

app.listen(port, () => console.log(`Server is running at port ${port}`));