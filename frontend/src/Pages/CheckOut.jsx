import React, { useContext, useEffect, useState } from 'react';
import './CSS/CheckOut.css';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const { getTotalCartAmount, token, all_product, cartItems, setCartItems, deliveryCharge, placeOrderAPI } = useContext(ShopContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    all_product.forEach((item) => {
        if (cartItems[item.id] > 0) {
            let itemInfo = { ...item, quantity: cartItems[item.id] };
            orderItems.push(itemInfo);
        }
    });

    console.log("Prepared Order Items:", orderItems); // Log orderItems for debugging

    let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + deliveryCharge,
    };

    const response = await placeOrderAPI(orderData);

    if (response?.success) {
        alert("Order placed successfully!");
        localStorage.removeItem('cartItems');
        setCartItems({});
        navigate('/');
    } else {
        alert("Order submission failed");
    }
};
  

  useEffect(() => {
    if (!token) {
      alert("To place an order, sign in first");
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={handleOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-field">
          <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
          <input type="text" name='lastName' onChange={onChangeHandler}value={data.lastName} placeholder='Last name' required />
        </div>
        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
        <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required/>
        <div className="multi-field">
          <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City'required/>
          <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required/>
        </div>
        <div className="multi-field">
          <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code'required/>
          <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
        </div>
        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p className='cart-heading'>Subtotal</p>
              <p>Tk.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p className='cart-heading'>Delivery Fee</p>
              <p>Tk.{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total:</b>
              <b> Tk.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}/-</b>
            </div>
          </div>
        </div>
        <div className="payment">
          <h2>Payment Method</h2>
          <div onClick={() => setPayment("cod")} className="payment-option">
            <p>COD (Cash on delivery)</p>
          </div>
        </div>
        <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
      </div>
    </form>
  );
};

export default PlaceOrder;
