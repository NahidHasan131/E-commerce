const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database Connection with MongoDB
mongoose.connect("mongodb+srv://nahid7532140:nahid7532140@cluster0.unytz.mongodb.net/e-commerce");


//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running...")
})


//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    } 
})

const upload =  multer({storage:storage})

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for Creating Products
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    availabe:{
        type:Boolean,
        default:true,
    }
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})


//Creating API for delating Product

app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})


//Creating API for Getting all products
app.get('/allproducts',async (req, res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Creating endpoint for registring the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] =0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

// Creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errrs:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong email id"})
    }
})


// Schema Creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating endponit for new collection data
app.get('/newcollection',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("newCollection Fetched");
    res.send(newcollection);
})

//Creating endponit for Popular in woman Section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
})

// Creating middleware to fetch user
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try{
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            }catch(error){
                res.status(401).send({errors:"Please authenticate using valid token"})
            }
        }
    }

//Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser, async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

// creating endpoint for search data
app.get('/search', async (req, res) => {
    const query = req.query.q; // Extract query from request
    if (!query || query.trim() === "") {
        return res.status(400).json({ success: false, error: "Search query cannot be empty" });
    }

    try {
        // Perform a case-insensitive search by name or category
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        });
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});



// Order model schema
const OrderModel = mongoose.model('Order', {
    address: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        phone: String,
    },
    items: [
        {
            id: Number,
            name: String,
            quantity: Number,
            new_price: Number,
        },
    ],
    amount: Number,
    status: { type: String, default: 'Order Processing' }, // Default status
    date: { type: Date, default: Date.now },
});

// Get data for orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await OrderModel.find(); // Ensure you're using the correct model name
        console.log("Orders Fetched from Database:", orders); // Log fetched orders
        res.send({ success: true, orders });
    } catch (err) {
        console.error("Error Fetching Orders:", err); // Log errors if any
        res.status(500).send({ success: false, message: err.message });
    }
});



// Creating endpoint for updating order status
app.post('/orders', async (req, res) => {
    try {
        console.log("Received Order Data:", req.body); // Debug input data
        const { address, items, amount } = req.body;

        // Validate input
        if (!address || !items || !amount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Save to database
        const newOrder = new OrderModel({
            address,
            items,
            amount,
        });

        const savedOrder = await newOrder.save();
        console.log("Order Saved:", savedOrder); // Debug saved order
        res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        console.error("Error while placing order:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


app.post('/orders/update-status', async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});






app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error: "+error)
    }
})






















