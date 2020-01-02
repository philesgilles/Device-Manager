import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import DeviceList from '../components/DeviceList/DeviceList';
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
import DeviceTypesSelect from '../components/Selects/DeviceTypeSelect';

class devices extends Component {
  state = {
    modal: false,
    devices: [],
    isLoading: false,
    selectedDevice: null,
    device: {},
    edit: false,
    delete: false
  };

  isActive = true;
  static contextType = AuthContext;

  toggle = () => {
    if (this.state.modal) {
      this.setState({
        selectedDevice: {},
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
    const selectedDevice = this.state.devices.find(e => e._id === id);
    let device = {
      uniqueId: selectedDevice.uniqueId,
      id: selectedDevice._id
    };
    await this.setState({ device: device, delete: true });
    this.toggle();
  };

  editdevice = async id => {
    const selectedDevice = this.state.devices.find(e => e._id === id);
    let device = {
      uniqueId: selectedDevice.uniqueId,
      name: selectedDevice.name,
      description: selectedDevice.description,
      organisationId: selectedDevice.organisationId,
      server: selectedDevice.config.server,
      port: selectedDevice.config.port,
      periodicity: selectedDevice.config.periodicity,
      id: selectedDevice['_id']
    };
    await this.setState({ device: device, edit: true });
    this.toggle();
  };

  componentDidMount() {
    this.fetchdevices();
  }

  fetchdevices = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/devices', {
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
        const devices = resData;
        if (this.isActive) {
          this.setState({ devices: devices, isLoading: false });
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

  createdevice = () => {
    let device = this.state.device;
    let method, url;
    let requestBody = {
      uniqueId: device.uniqueId,
      name: device.name,
      description: device.description || '',
      config: {
        server: device.server || '',
        port: device.port || '',
        periodicity: device.periodicity || ''
      },
      organisationId: device.organisationId,
      deviceType: device.deviceTypeId
    };
    if (this.state.edit) {
      delete device.password;
      url = 'http://localhost:3000/devices/' + device.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/devices';
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
        this.fetchdevices();
        this.toggle();
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
    this.setState({ device: {} });
  };

  deletedevice = () => {
    fetch('http://localhost:3000/devices/' + this.state.device.id, {
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
        this.fetchdevices();
        this.toggle();
        this.setState({ delete: false, device: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let device = this.state.device;
    device[target.name] = target.value;
    this.setState({ device });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <DeviceList
            //authdeviceId={this.context.deviceId}
            devices={this.state.devices}
            onEdit={this.editdevice}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            device
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete{' '}
                <b>{this.state.device.uniqueId}</b>
              </h5>
            ) : (
              <form>
                <div className='grey-text'>
                  <MDBInput
                    label='unique Id'
                    icon='hashtag'
                    name='uniqueId'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.device.uniqueId}
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
                    value={this.state.device.name}
                    success='right'
                    onChange={this.changeHandler}
                  />
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Organisation :</span>
                    </MDBCol>
                    <MDBCol md='12'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-building prefix'></i>
                        <OrganisationsSelect
                          value={this.state.device.organisationId}
                          changed={this.changeHandler}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Device Type :</span>
                    </MDBCol>
                    <MDBCol md='12'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-building prefix'></i>
                        <DeviceTypesSelect
                          value={this.state.device.organisationId}
                          changed={this.changeHandler}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Configuration :</span>
                    </MDBCol>
                    <MDBCol md='4'>
                      <MDBInput
                        label='Server'
                        icon='cogs'
                        group
                        type='text'
                        validate
                        error='wrong'
                        name='server'
                        value={this.state.device.server}
                        success='right'
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='4'>
                      <MDBInput
                        label='port'
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='port'
                        value={this.state.device.port}
                        success='right'
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='4'>
                      <MDBInput
                        label='Periodicity (s)'
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='periodicity'
                        value={this.state.device.periodicity}
                        success='right'
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    type='textarea'
                    rows='2'
                    label='Description / Informations'
                    name='description'
                    icon='info'
                    value={this.state.device.description}
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
                onClick={this.deletedevice}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createdevice}
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

export default devices;
