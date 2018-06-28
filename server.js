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

let items = [{ itemname:"item15", imgsrc:"img1"},{ itemname:"item2", imgsrc:"img2"},{ itemname:"item3", imgsrc:"img3"},{ itemname:"item4", imgsrc:"img4"},{ itemname:"item5", imgsrc:"img5"}]
let users = [{username: "mukesh", password: "12345678", mobile: "9988776655"},{username: "rakesh", password: "12345678", mobile: "9988776655"}]
let currentuser = {username: "mukesh", password: "12345678", mobile: "9988776655"}
let cart = [{username:"raj1", cartitem:[{itemname:"item2", imgsrc:"img2"}]}]


app.post('/getCurrentUser',function(req,res){
  var response = "check";
  res.send(currentuser);
});


app.post('/setCurrentUser',function(req,res){
 // res.send(req.body);
  if(JSON.stringify(req.body) === JSON.stringify({}))
  	currentuser = {};
  else{
  	let user = JSON.parse(req.body.user);
  	currentuser = user;
  }
  res.send(currentuser);
  
});

app.post('/setItemsinCart',function(req,res){
  console.log("in itemin cart");
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
  		cart[i].cartitem = JSON.parse(req.body.cartitem)
  		flag= true;
  		console.log("equal");
  		res.send(cart);
  	}	
  }
  if(flag==false)
  	cart.push({username:req.body.username, cartitem: JSON.parse(req.body.cartitem)});
  res.send(cart);
 
   
  
 // res.send(this.cart);

});

app.post('/getItemsinCart',function(req,res){  
  /*if(JSON.stringify(req.body) === JSON.stringify([]))
  	this.cart = [];
  else{
  	this.cart = JSON.parse(req.body.use);
  }*/
  //res.send(cart);
  for(let i=0;i<cart.length;i++){
  	if(cart[i].username==req.body.currentuser)
  		res.send(cart[i].cartitem);
  }
   
  res.send("[]");

});
app.post('/temp',function(req,res){ res.send(currentuser)});

app.get('/getItems',function(req,res){
  res.send(items);
});

app.post('/getAllUsers',function(req,res){
  var response = "check";
  res.send(users);
});

app.post('/setAllUsers',function(req,res){
 // res.send(req.body);
  /*if(JSON.stringify(req.body) === JSON.stringify({}))
  	this.users = {};
  else{*/
  	users = JSON.parse(req.body.allusers);
  //}
  res.send(users);
});



app.listen(8080,function(){
  console.log("Started on PORT 3000");
})