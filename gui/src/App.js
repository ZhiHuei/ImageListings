import './App.scss';
import Home from './components/home/Home';
import Signin from './components/signin/Signin';
import React, {useState, useEffect} from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <div className="App-header">
        <span className="logo">
          <div className="vl">
            <span>Image Listing Application</span>
            <p>Display, Rate and Download photos here!</p>
          </div>
        </span>
      </div>

      <div className="App-body">
        { isLoggedIn ? <Home></Home> : <Signin></Signin>}        
      </div>
    </div>
  );
}

export default App;
