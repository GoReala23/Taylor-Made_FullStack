import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [isLeftSide, setIsLeftSide] = useState(false);
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser);

  const togglePosition = () => {
    setIsLeftSide(!isLeftSide);
    document.body.classList.toggle('dashboard__le ft');
  };

  return (
    <div
      className={`dashboard ${isLeftSide ? 'dashboard__left' : ''} ${!isLeftSide ? 'dashboard__right' : ''}`}
    >
      <nav className='dashboard__nav'>
        <ul className='dashboard__nav-list'>
          <li className='dashboard__nav-item'>
            <Link to='/' className='dashboard__nav-link'>
              Home
            </Link>
          </li>

          <li className='dashboard__nav-item'>
            <Link to='/orders' className='dashboard__nav-link'>
              Orders
            </Link>
          </li>
          <li className='dashboard__nav-item'>
            <Link to='/cart' className='dashboard__nav-link'>
              Cart
            </Link>
          </li>
          <li className='dashboard__nav-item'>
            <Link to='/settings' className='dashboard__nav-link'>
              Settings
            </Link>
          </li>
          {currentUser?.isAdmin && (
            <li className='dashboard__nav-item'>
              <Link to='/admin/products' className='dashboard__nav-link'>
                Manage Products
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <button className='dashboard__toggle' onClick={togglePosition}>
        {isLeftSide ? 'Move to Top' : 'Move to Left'}
      </button>
    </div>
  );
};

export default Dashboard;
