import axios from 'axios';
import React, { useState } from "react";
import config from '../../config.json';

function Register(props) {
    const [signInEmail, setSignInEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmitRegister() {
        const result = await axios.post(config.serverUrl + '/register',
            JSON.stringify({
                email: signInEmail,
                password: password
            }),
            {
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
            }
        );
        if (result.status === 200) {
            props.onRouteChange('signin')
        }
    }

    function onEmailChange(event) {
        setSignInEmail(event.target.value);
    }

    function onPasswordChange(event) {
        setPassword(event.target.value);
    }

    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
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
                            onClick={onSubmitRegister}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value="Register"
                        />
                    </div>
                </div>
            </main>
        </article>
    )
}


export default Register;