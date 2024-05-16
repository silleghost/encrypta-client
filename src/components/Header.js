import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    let {user, userLogout} = useContext(AuthContext)
  return (
    <div>
        <Link to="/">Home</Link>
        {user ? (
            <p onClick={userLogout}>Logout</p>
        ): (
            <p>
                {/* <Link to="/login">Login</Link> */}
            </p>
        )}
        {user && <p>Hello, {user.username}</p>}
    </div>
  )
}

export default Header