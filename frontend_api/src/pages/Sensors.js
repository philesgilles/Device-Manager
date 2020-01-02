import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import SensorList from '../components/SensorList/SensorList';
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

import DevicesSelect from '../components/Selects/DeviceSelect';
import EquipmentsSelect from '../components/Selects/EquipmentSelect';

class sensors extends Component {
  state = {
    modal: false,
    sensors: [],
    isLoading: false,
    selectedsensor: null,
    sensor: {},
    edit: false,
    delete: false
  };

  isActive = true;
  static contextType = AuthContext;

  toggle = () => {
    if (this.state.modal) {
      this.setState({
        selectedsensor: {},
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
    const selectedSensor = this.state.sensors.find(e => e._id === id);
    let sensor = {
      uniqueId: selectedSensor.uniqueId,
      id: selectedSensor._id
    };
    await this.setState({ sensor: sensor, delete: true });
    this.toggle();
  };

  editsensor = async id => {
    const selectedSensor = this.state.sensors.find(e => e._id === id);
    let sensor = {
      uniqueId: selectedSensor.uniqueId,
      description: selectedSensor.description,
      type: selectedSensor.type,
      deviceId: selectedSensor.deviceId,
      equipmentId: selectedSensor.equipmentId,
      id: selectedSensor['_id']
    };
    await this.setState({ sensor: sensor, edit: true });
    this.toggle();
  };

  componentDidMount() {
    this.fetchsensors();
  }

  fetchsensors = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/sensors', {
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
        const sensors = resData;
        if (this.isActive) {
          this.setState({ sensors: sensors, isLoading: false });
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

  createsensor = () => {
    let sensor = this.state.sensor;
    let method, url;
    let requestBody = {
      uniqueId: sensor.uniqueId,
      description: sensor.description,
      type: sensor.type,
      deviceId: sensor.deviceId,
      equipmentId: sensor.equipmentId
    };
    if (this.state.edit) {
      delete sensor.password;
      url = 'http://localhost:3000/sensors/' + sensor.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/sensors';
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
        this.fetchsensors();
        this.toggle();
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
    this.setState({ sensor: {} });
  };

  deletesensor = () => {
    fetch('http://localhost:3000/sensors/' + this.state.sensor.id, {
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
        this.fetchsensors();
        this.toggle();
        this.setState({ delete: false, sensor: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let sensor = this.state.sensor;
    sensor[target.name] = target.value;
    this.setState({ sensor });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <SensorList
            //authsensorId={this.context.sensorId}
            sensors={this.state.sensors}
            onEdit={this.editsensor}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            sensor
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete{' '}
                <b>{this.state.sensor.uniqueId}</b>
              </h5>
            ) : (
              <form>
                <div className='grey-text'>
                  <MDBInput
                    label='Unique Id'
                    icon='hashtag'
                    name='uniqueId'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.sensor.uniqueId}
                    onChange={this.changeHandler}
                  />
                  <MDBInput
                    label='Sensor Type'
                    icon='cog'
                    name='type'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.sensor.type}
                    onChange={this.changeHandler}
                  />
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Linked Device :</span>
                    </MDBCol>
                    <MDBCol md='12'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-pager prefix'></i>
                        <DevicesSelect
                          value={this.state.sensor.organisationId}
                          changed={this.changeHandler}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Equipment :</span>
                    </MDBCol>
                    <MDBCol md='12'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-tag prefix'></i>
                        <EquipmentsSelect changed={this.changeHandler} />
                      </div>
                    </MDBCol>
                  </MDBRow>

                  <MDBInput
                    type='textarea'
                    rows='2'
                    label='Description / Informations'
                    name='description'
                    icon='info'
                    value={this.state.sensor.description}
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
                onClick={this.deletesensor}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createsensor}
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

export default sensors;
