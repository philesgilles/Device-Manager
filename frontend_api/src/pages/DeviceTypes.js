import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import DeviceTypeList from '../components/DeviceTypeList/DeviceTypeList';
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput
} from 'mdbreact';

class deviceTypes extends Component {
  state = {
    modal: false,
    deviceTypes: [],
    isLoading: false,
    selecteddeviceType: null,
    deviceType: {},
    edit: false,
    delete: false
  };

  isActive = true;
  static contextType = AuthContext;

  toggle = () => {
    if (this.state.modal) {
      this.setState({
        selecteddeviceType: {},
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
    const selecteddeviceType = this.state.deviceTypes.find(e => e._id === id);
    let deviceType = {
      uniqueId: selecteddeviceType.uniqueId,
      id: selecteddeviceType._id
    };
    await this.setState({ deviceType: deviceType, delete: true });
    this.toggle();
  };

  editdeviceType = async id => {
    const selecteddeviceType = this.state.deviceTypes.find(e => e._id === id);
    let deviceType = {
      uniqueId: selecteddeviceType.uniqueId,
      name: selecteddeviceType.name,
      description: selecteddeviceType.description,
      id: selecteddeviceType['_id']
    };
    await this.setState({ deviceType: deviceType, edit: true });
    this.toggle();
  };

  componentDidMount() {
    this.fetchdeviceTypes();
  }

  fetchdeviceTypes = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/deviceTypes', {
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
        const deviceTypes = resData;
        if (this.isActive) {
          this.setState({ deviceTypes: deviceTypes, isLoading: false });
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

  createdeviceType = () => {
    let deviceType = this.state.deviceType;
    let method, url;
    let requestBody = {
      uniqueId: deviceType.uniqueId,
      name: deviceType.name,
      description: deviceType.description || ''
    };
    if (this.state.edit) {
      delete deviceType.password;
      url = 'http://localhost:3000/deviceTypes/' + deviceType.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/deviceTypes';
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
        this.fetchdeviceTypes();
        this.toggle();
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
    this.setState({ deviceType: {} });
  };

  deletedeviceType = () => {
    fetch('http://localhost:3000/deviceTypes/' + this.state.deviceType.id, {
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
        this.fetchdeviceTypes();
        this.toggle();
        this.setState({ delete: false, deviceType: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let deviceType = this.state.deviceType;
    deviceType[target.name] = target.value;
    this.setState({ deviceType });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <DeviceTypeList
            //authdeviceTypeId={this.context.deviceTypeId}
            deviceTypes={this.state.deviceTypes}
            onEdit={this.editdeviceType}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            deviceType
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete{' '}
                <b>{this.state.deviceType.uniqueId}</b>
              </h5>
            ) : (
              <form>
                <div className='grey-text'>
                  <MDBInput
                    label='internal Id'
                    icon='hashtag'
                    name='uniqueId'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.deviceType.uniqueId}
                    onChange={this.changeHandler}
                  />
                  <MDBInput
                    label='Name'
                    icon='digital-tachograph'
                    group
                    type='text'
                    validate
                    error='wrong'
                    name='name'
                    value={this.state.deviceType.name}
                    success='right'
                    onChange={this.changeHandler}
                  />

                  <MDBInput
                    type='textarea'
                    rows='2'
                    label='Description / Informations'
                    name='description'
                    icon='info'
                    value={this.state.deviceType.description}
                    onChange={this.changeHandler}
                  />
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
                onClick={this.deletedeviceType}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createdeviceType}
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

export default deviceTypes;
