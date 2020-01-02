import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import MainNavigation from './components/Core/Navigation/MainNavigation';
import Organisations from './pages/Organisations';
import Calibrations from './pages/Calibrations';
import Sensors from './pages/Sensors';
import Devices from './pages/Devices';
import DeviceTypes from './pages/DeviceTypes';
import Equipments from './pages/Equipments';
import Users from './pages/Users';
import AuthPage from './pages/Auth';

import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className='main-content'>
              <Switch>
                {this.state.token && <Redirect from='/' to='/devices' exact />}
                {this.state.token && (
                  <Redirect from='/auth' to='/devices' exact />
                )}
                {!this.state.token && (
                  <Route path='/auth' component={AuthPage} />
                )}
                {this.state.token && (
                  <React.Fragment>
                    <Route path='/organisations' component={Organisations} />
                    <Route path='/users' component={Users} />
                    <Route path='/devices' component={Devices} />
                    <Route path='/deviceTypes' component={DeviceTypes} />
                    <Route path='/equipments' component={Equipments} />
                    <Route path='/sensors' component={Sensors} />
                    <Route path='/calibrations' component={Calibrations} />
                  </React.Fragment>
                )}

                {!this.state.token && <Redirect to='/auth' exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
