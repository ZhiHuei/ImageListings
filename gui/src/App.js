import './App.scss';
import Home from './components/home/Home';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import React, { useState, useEffect } from "react";
import config from './config.json';
import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [route, setRoute] = useState('signin');

    useEffect(() => {
        const login = async () => {
            const result = await axios.post(config.serverUrl + '/signin', '',
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                }
            );
            if (result.status === 200) {
                console.log('success: should return profile id');
                setRoute('home');
                // TODO: Load user details
            } else {
                console.log('Sign in with token failed.')
            }
        }
        
        const token = window.sessionStorage.getItem('token');
        if (token) {
            console.log('useEffect');
            login();
        }
    }, [])
    function onRouteChange(route) {
        if (route === 'signout') {
            setIsLoggedIn(false);
        } else if (route === 'home') {
            setIsLoggedIn(true);
        }
        setRoute(route);
    }

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
                {route === 'home' ?
                    <Home></Home> :
                    (route === 'signin' ?
                        <Signin onRouteChange={onRouteChange}></Signin> :
                        <Register onRouteChange={onRouteChange}></Register>
                    )
                }
            </div>
        </div>
    );
}

export default App;
