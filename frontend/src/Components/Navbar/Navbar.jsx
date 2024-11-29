import React, { useContext, useRef } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {

    const [menu,setMenu] = useState("home");
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef()

    const dropdown_toggle = (e)=>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

  return (
    <div className='navbar'>
        <Link to='/' style={{textDecoration: 'none',color: '#626262'}}>
            <div className="nav-logo">
                <img src={logo} alt="logo.png" />
                <p>N&N Shopper</p>
            </div>
        </Link>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
        <ul ref={menuRef} className="nav-menu">
            <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/'><i className="fa-solid fa-house"></i> Home</Link>{menu==="home"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/mens'><i className="fa-solid fa-user-tie"></i> Men</Link>{menu==="mens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/womens'><i className="fa-solid fa-user-large"></i> Women</Link>{menu==="womens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none',color: '#626262'}} to='/kids'><i className="fa-solid fa-user-astronaut"></i> Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("search")}}><span><i className="fa-solid fa-magnifying-glass"></i> Search</span></li>
        </ul>
        <div className="nav-login-cart">
            {localStorage.getItem('auth-token')
            ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>:
            <Link to='/login'><button className='loginBtn'>Login</button></Link>}
            
            <Link to='/cart'><img src={cart_icon} alt=""/></Link>     
            <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar