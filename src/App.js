import React, { Component } from 'react';
import './App.scss';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import AppRoute from './AppRoute';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <AppRoute />
        <Footer />
      </div>
    );
  }
}

export default App;
