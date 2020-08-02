import React, { Component } from 'react';
import './App.css';
// import Home from './components/Home';
import Routes from './routes/Routes';
class App extends Component {

  render (){
    return (
      <div>
       {/* <Home/> */}
       <Routes/>
      </div>
    );
  }
}

export default App;
