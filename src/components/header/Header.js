import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './header.scss';

class Header extends Component {
  render() {
    return (
        <header className="App-header">
          <div className="brand">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/OmiseGO_Logo.svg"
            className="App-logo" alt="logo" />
          </div>
          <nav>
            <ul>
              <li><NavLink exact to='/'>Json Format</NavLink></li>
              <li><NavLink to='/git'>Git Page</NavLink></li>
            </ul>
          </nav>
        </header>
    );
  }
}

export default Header;
