import axios from 'axios';
import React, { useState } from "react";
import config from '../../config.json';

function Signin(props) {
    const [signInEmail, setSignInEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmitSignIn() {
        const result = await axios.post(config.serverUrl + '/signin',
            JSON.stringify({
                email: signInEmail,
                password: password
            }),
            {
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
            }
        );
        console.log(result);
        if (result.status === 200) {
            saveAuthToken(result.data.token);
            props.onRouteChange('home');
            // TODO: load profile details
        } else {
            console.log('Invalid email or password.')
        }
    }

    function onEmailChange(event) {
        setSignInEmail(event.target.value);
    }

    function onPasswordChange(event) {
        setPassword(event.target.value);
    }

    function saveAuthToken(token) {
        window.sessionStorage.setItem('token', token);
    }

    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="email"
                                name="email-address"
                                id="email-address"
                                onChange={onEmailChange}
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password"
                                name="password"
                                id="password"
                                onChange={onPasswordChange}
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            onClick={onSubmitSignIn}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value="Sign in"
                        />
                    </div>
                    <div className="lh-copy mt3">
                        <p  onClick={() => props.onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                    </div>
                </div>
            </main>
        </article>
    )
}


export default Signin;