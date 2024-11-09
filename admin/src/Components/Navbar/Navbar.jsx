import { Link } from 'react-router-dom'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="navbar-container">
            <Link to={'/'}><img src={navlogo} alt="" className='nav-logo'/></Link>
            <img src={navProfile} alt="" className='nav-profile'/>
        </div>
    </div>
  )
}

export default Navbar