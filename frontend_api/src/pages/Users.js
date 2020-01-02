import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import UserList from '../components/UserList/UserList';
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
  MDBRow,
  MDBCol
} from 'mdbreact';

import OrganisationsSelect from '../components/Selects/OrganisationSelect';

class users extends Component {
  state = {
    modal: false,
    users: [],
    isLoading: false,
    selecteduser: null,
    user: {},
    edit: false,
    delete: false
  };

  isActive = true;
  static contextType = AuthContext;

  toggle = () => {
    if (this.state.modal) {
      this.setState({
        organisation: {},
        edit: false,
        delete: false
      });
    }
    this.setState({
      modal: !this.state.modal
    });
  };

  deleteHandler = async id => {
    this.setState({ delete: true });
    const selectedUser = this.state.users.find(e => e._id === id);
    let user = {
      name: selectedUser.username,
      id: selectedUser._id
    };
    await this.setState({ user: user, delete: true });
    this.toggle();
  };

  edituser = async id => {
    const selectedUser = this.state.users.find(e => e._id === id);
    let user = {
      username: selectedUser.username,
      email: selectedUser.email,
      firstname: selectedUser.info.firstname,
      lastname: selectedUser.info.lastname,
      tel: selectedUser.info.telephone,
      organisationId: selectedUser.organisationId,
      id: selectedUser['_id']
    };
    await this.setState({ user: user, edit: true });
    this.toggle();
  };

  componentDidMount() {
    this.fetchusers();
  }

  fetchusers = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/users', {
      method: 'GET',
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
        const users = resData;
        if (this.isActive) {
          this.setState({ users: users, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  createuser = () => {
    let user = this.state.user;
    let method, url;
    let requestBody = {
      username: user.username,
      email: user.email,
      password: user.password1,
      info: {
        firstname: user.firstname,
        lastname: user.lastname,
        telephone: user.telephone
      },
      organisationId: user.organisationId
    };
    if (this.state.edit) {
      delete user.password;
      url = 'http://localhost:3000/users/' + user.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/users';
      method = 'POST';
    }
    fetch(url, {
      method: method,
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
        this.fetchusers();
        this.toggle();
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  deleteuser = () => {
    fetch('http://localhost:3000/users/' + this.state.user.id, {
      method: 'DELETE',
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
        this.fetchusers();
        this.toggle();
        this.setState({ delete: false, user: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let user = this.state.user;
    user[target.name] = target.value;
    this.setState({ user });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <UserList
            //authUserId={this.context.userId}
            users={this.state.users}
            onEdit={this.edituser}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            user
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete <b>{this.state.user.name}</b>
              </h5>
            ) : (
              <form>
                <div className='grey-text'>
                  <MDBInput
                    label='Username'
                    icon='user'
                    name='username'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.user.username}
                    onChange={this.changeHandler}
                  />
                  {!this.state.edit ? (
                    <MDBRow>
                      <MDBCol md='6'>
                        <MDBInput
                          label='Password'
                          icon='key'
                          group
                          type='text'
                          validate
                          error='wrong'
                          name='password1'
                          success='right'
                          onChange={this.changeHandler}
                        />
                      </MDBCol>
                      <MDBCol md='6'>
                        <MDBInput
                          label='repeat Password'
                          icon=''
                          group
                          type='text'
                          validate
                          error='wrong'
                          name='password2'
                          success='right'
                          onChange={this.changeHandler}
                        />
                      </MDBCol>
                    </MDBRow>
                  ) : (
                    ''
                  )}
                  <hr />
                  <MDBRow>
                    <MDBCol md='6'>
                      <MDBInput
                        label='First name'
                        icon='id-card'
                        group
                        type='text'
                        validate
                        error='wrong'
                        name='firstname'
                        success='right'
                        value={this.state.user.firstname}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='6'>
                      <MDBInput
                        label='Last name'
                        icon=''
                        group
                        type='text'
                        validate
                        error='wrong'
                        name='lastname'
                        success='right'
                        value={this.state.user.lastname}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md='6'>
                      <MDBInput
                        label='Telephone'
                        icon='phone'
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='telephone'
                        success='right'
                        value={this.state.user.telephone}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='6'>
                      <MDBInput
                        label='Email'
                        icon='at'
                        group
                        type='email'
                        validate
                        error='wrong'
                        name='email'
                        success='right'
                        value={this.state.user.email}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Organisation :</span>
                    </MDBCol>
                    <MDBCol md='12'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-building prefix'></i>
                        <OrganisationsSelect changed={this.changeHandler} />
                      </div>
                    </MDBCol>
                  </MDBRow>
                </div>
              </form>
            )}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='orange' outline onClick={this.toggle}>
              Cancel
            </MDBBtn>
            {this.state.delete ? (
              <MDBBtn
                type='submit'
                onClick={this.deleteuser}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createuser}
                color='green darken-2'
              >
                {this.state.edit ? 'Update' : 'Save'}
              </MDBBtn>
            )}
          </MDBModalFooter>
        </MDBModal>
      </React.Fragment>
    );
  }
}

export default users;
