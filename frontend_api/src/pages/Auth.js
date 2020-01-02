import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';

import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      email: email,
      password: password
    };
    //console.log(JSON.stringify(requestBody));
    fetch('http://localhost:3000/auth', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed !');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.token) {
          this.context.login(
            resData.token,
            resData.userId,
            resData.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBRow center>
            <MDBCol md='6'>
              <form onSubmit={this.submitHandler}>
                <p className='h4 text-center mb-4'>Sign in</p>
                <label htmlFor='defaultFormLoginEmailEx' className='grey-text'>
                  Your email
                </label>
                <input
                  type='email'
                  id='defaultFormLoginEmailEx'
                  className='form-control'
                  ref={this.emailEl}
                />
                <br />
                <label
                  htmlFor='defaultFormLoginPasswordEx'
                  className='grey-text'
                >
                  Your password
                </label>
                <input
                  type='password'
                  id='defaultFormLoginPasswordEx'
                  className='form-control'
                  ref={this.passwordEl}
                />
                <div className='text-center mt-4'>
                  <MDBBtn color='green darken-2' type='submit'>
                    Login
                  </MDBBtn>
                </div>
              </form>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

export default AuthPage;
