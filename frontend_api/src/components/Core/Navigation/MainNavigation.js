import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../../context/auth-context';
import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className='main-navigation'>
          <div className='main-navigation__logo'>
            <h1>PGP Device manager</h1>
          </div>
          <nav className='main-navigation__items'>
            <ul>
              {!context.token && (
                <li>
                  <NavLink to='/auth'>Authorisation</NavLink>
                </li>
              )}
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to='/organisations'>Organisations</NavLink>
                  </li>
                  <li>
                    <NavLink to='/users'>Users</NavLink>
                  </li>
                  <li>
                    <NavLink to='/equipments'>Equipments</NavLink>
                  </li>
                  <li>
                    <NavLink to='/devices'>Devices</NavLink>
                  </li>
                  <li>
                    <NavLink to='/deviceTypes'>Device-types</NavLink>
                  </li>
                  <li>
                    <NavLink to='/sensors'>Sensors</NavLink>
                  </li>
                  <li>
                    <NavLink to='/calibrations'>Calibrations</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
