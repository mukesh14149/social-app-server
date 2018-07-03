var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var cors = require("cors");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
/*app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});
*/
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mukesh14149@localhost:5432/testdb';

const client = new pg.Client(connectionString);
client.connect();



let items = [{ itemname:"item15", imgsrc:"img1"},{ itemname:"item2", imgsrc:"img2"},{ itemname:"item3", imgsrc:"img3"},{ itemname:"item4", imgsrc:"img4"},{ itemname:"item5", imgsrc:"img5"}]
let users = [{username: "rahul", password: "12345678", mobile: "9988776655"},{username: "rakesh", password: "12345678", mobile: "9988776655"}]
let currentuser = {username: "rukesh", password: "12345678", mobile: "9988776655"}
let cart = [{username:"mukesh", cartitem:[{itemname:"item2", imgsrc:"img2"}]}]


app.post('/getCurrentUser',function(req,res){
  var response = "check";
  const query = client.query('select username,password,mobile from currentuser');	 
  query.then((resp) => {
  	let temp = (resp.rows)[0]
  	res.send(JSON.stringify(temp))
  });

});


app.post('/setCurrentUser',function(req,res){
 // res.send(req.body);
  
  /*if(JSON.stringify(req.body) === JSON.stringify({}))
  	currentuser = {};
  else{
  	let user = JSON.parse(req.body.user);
  	currentuser = user;
  }
  res.send(currentuser);*/
    currentuser = JSON.parse(req.body.user);
  	const query = client.query('insert into currentuser(username, password, mobile) values($1,$2,$3)',[currentuser.username, currentuser.password, currentuser.mobile]);	 
  	res.send("Set current users");
});

app.post('/removeCurrentUser',function(req,res){
 // res.send(req.body);
  
  /*if(JSON.stringify(req.body) === JSON.stringify({}))
  	currentuser = {};
  else{
  	let user = JSON.parse(req.body.user);
  	currentuser = user;
  }
  res.send(currentuser);*/
    currentuser = {};
  	const query = client.query('delete from currentuser');	 
  	res.send("remove current users");
});



app.post('/removeIteminCart',function(req,res){
  const query = client.query('delete from cart where username = $1 and itemname = $2',[req.body.username,req.body.itemname]);

  res.send("Deleted item in cart");
});  

app.post('/setItemsinCart',function(req,res){
  const query = client.query('INSERT INTO cart(username, itemname) values($1,$2)',[req.body.username, req.body.itemname]);

  res.send("this.cart");

  /*console.log("in itemin cart");
  let len= cart.length ;
  let flag = false;
  //for(let j in cart)
  	//len = len+1;
  for(let i=0;i<len;i++){
  	console.log(cart);
  	console.log("checckkkkkkkk");
  	console.log(req.body.username);

  	if(cart[i].username==req.body.username)
  	{	
  		console.log("checckkkkkkkk2222")
  		console.log(req.body.cartitem);
  		cart[i].cartitem = JSON.parse(req.body.cartitem)
  		flag= true;
  		console.log("equal");
  		res.send(cart);
  	}	
  }
  console.log("checckkkkkkkk2222")
  console.log(req.body.cartitem);
  if(flag==false)
  	cart.push({username:req.body.username, cartitem: JSON.parse(req.body.cartitem)});
  res.send(cart);
 */
   
  
});

app.post('/getItemsinCart',function(req,res){  
  /*if(JSON.stringify(req.body) === JSON.stringify([]))
  	this.cart = [];
  else{
  	this.cart = JSON.parse(req.body.use);
  }*/
  //res.send(cart);
  
  const query = client.query('select items.itemname, items.imgsrc from items inner join cart on cart.itemname = items.itemname and cart.username = $1',[req.body.currentuser]);
  query.then((resp) => res.send(JSON.stringify(resp.rows)))
  /*for(let i=0;i<cart.length;i++){
  	if(cart[i].username==req.body.currentuser)
  		res.send(cart[i].cartitem);
  }
   
  res.send("[]");*/

});
app.post('/temp',function(req,res){ res.send(cart)});

app.get('/getItems',function(req,res){
  const query = client.query('SELECT itemname,imgsrc FROM items');
  query.then((resp) => res.send(resp.rows));
//  res.send(items);
}); 

app.get('/setItems',function(req,res){
  // for(let i=0;i<items.length;i++){
  // 	console.log(items[i]);
  // 	const query1 = client.query('INSERT INTO items(itemname, imgsrc) values($1,$2)',[items[i].itemname, items[i].imgsrc]);	
  // }
  const query1 = client.query('insert into items (itemname, imgsrc) select itemname, imgsrc from jsonb_to_recordset(\'' + JSON.stringify(items)  + '\') r (itemname varchar, imgsrc varchar)');	 
  	res.send("Set Items");
}); 

app.post('/getAllUsers',function(req,res){
  var response = "check";
  res.send(users);
});

app.post('/getuserinfo',function(req,res){
   console.log(req.body.username);
	   console.log(req.body.password);

   const query = client.query('select * from users where username=$1 and password=$2',[req.body.username, req.body.password])
   query.then((resp)=> 
	{   
			console.log(resp.rows);
	   		res.send(JSON.stringify(resp.rows))
   });


});

app.post('/setAllUsers',function(req,res){
 // res.send(req.body);
  /*if(JSON.stringify(req.body) === JSON.stringify({}))
  	this.users = {};
  else{*/
  	users = [JSON.parse(req.body.newuser)];
  	const query = client.query('insert into users (username, password, mobile) select username, password, mobile from jsonb_to_recordset(\'' + JSON.stringify(users)  + '\') r (username varchar, password varchar, mobile bigint)');	 
  	query.then((resp) => res.send("set users")).catch((err) => res.send("Error"));
  
  //}
 // res.send(users);
});



app.listen(8080,function(){
  console.log("Started on PORT 3000");
})