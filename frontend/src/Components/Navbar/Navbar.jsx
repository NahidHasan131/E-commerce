import React from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const [menu,setMenu] = useState("home");

  return (
    <div className='navbar'>
        <Link to='/' style={{textDecoration: 'none',color: '#626262'}}>
            <div className="nav-logo">
                <img src={logo} alt="logo.png" />
                <p>N&N Shopper</p>
            </div>
        </Link>
        <ul className="nav-menu">
            <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/'><i class="fa-solid fa-house"></i> Home</Link>{menu==="home"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/shop'><i class="fa-solid fa-cart-plus"></i> shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/mens'><i class="fa-solid fa-user-tie"></i> Men</Link>{menu==="mens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/womens'><i class="fa-solid fa-user-large"></i> Women</Link>{menu==="womens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/kids'><i class="fa-solid fa-user-astronaut"></i> Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
            <Link to='/login'><button>Login</button></Link>
            <Link to='/cart'><img src={cart_icon} alt=""/></Link>     
            <div className="nav-cart-count">0</div>
        </div>
    </div>
  )
}

export default Navbar