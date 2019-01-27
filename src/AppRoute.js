import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import JsonFormatPage from './components/JsonFormatPage/JsonFormatPage';
import GitPage from './components/gitPage/GitPage';

class AppRoute extends Component{
  render(){
  return(
  <div>
    <Route exact path="/" component={JsonFormatPage}/>
    <Route path="/git" component={GitPage}/>
  </div>
  )
  }
};

export default AppRoute;