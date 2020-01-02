import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import CalibrationList from '../components/CalibrationList/CalibrationList';
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

import SensorSelect from '../components/Selects/SensorSelect';

class calibrations extends Component {
  state = {
    modal: false,
    calibrations: [],
    isLoading: false,
    selectedcalibration: null,
    calibration: {},
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
    const selectedcalibration = this.state.calibrations.find(e => e._id === id);
    let calibration = {
      certificateNumber: selectedcalibration.certificateNumber,
      id: selectedcalibration._id
    };
    await this.setState({ calibration: calibration, delete: true });
    this.toggle();
  };

  editcalibration = async id => {
    const selectedCalibration = this.state.calibrations.find(e => e._id === id);
    let calibration = {
      certificateNumber: selectedCalibration.certificateNumber,
      sensorId: selectedCalibration.sensorId,
      calA: selectedCalibration.values.calA,
      calB: selectedCalibration.values.calB,
      calC: selectedCalibration.values.calC,
      validFrom: selectedCalibration.values.validFrom,
      validTo: selectedCalibration.values.validTo,
      id: selectedCalibration['_id']
    };
    await this.setState({ calibration: calibration, edit: true });
    this.toggle();
    console.log(this.state.calibration);
  };

  componentDidMount() {
    this.fetchcalibrations();
  }

  fetchcalibrations = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/calibrations', {
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
        const calibrations = resData;
        if (this.isActive) {
          this.setState({ calibrations: calibrations, isLoading: false });
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

  createcalibration = () => {
    let calibration = this.state.calibration;
    let method, url;
    console.log(calibration);
    let requestBody = {
      certificateNumber: calibration.certificateNumber,
      sensorId: calibration.sensorId,
      values: {
        calA: calibration.calA,
        calB: calibration.calB,
        calC: calibration.calC,
        validTo: calibration.validTo,
        validFrom: calibration.validFrom
      }
    };
    if (this.state.edit) {
      delete calibration.password;
      url = 'http://localhost:3000/calibrations/' + calibration.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/calibrations';
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
        this.fetchcalibrations();
        this.toggle();
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  deletecalibration = () => {
    fetch('http://localhost:3000/calibrations/' + this.state.calibration.id, {
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
        this.fetchcalibrations();
        this.toggle();
        this.setState({ delete: false, calibration: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let calibration = this.state.calibration;
    calibration[target.name] = target.value;
    this.setState({ calibration });
  };

  // Format date for date input
  formatDate = date => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <CalibrationList
            //authcalibrationId={this.context.calibrationId}
            calibrations={this.state.calibrations}
            onEdit={this.editcalibration}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            calibration
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete{' '}
                <b>{this.state.calibration.certificateNumber}</b>
              </h5>
            ) : (
              <form>
                <div className='grey-text'>
                  <MDBInput
                    label='Certificate Number'
                    icon='hashtag'
                    name='certificateNumber'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.calibration.certificateNumber}
                    onChange={this.changeHandler}
                  />
                  <MDBRow>
                    <MDBCol md='12' className='select-label'>
                      <span className='margin40'>Sensor :</span>
                    </MDBCol>
                    <MDBCol md='12'>
                      <div className='md-form form-group'>
                        <i
                          data-test='fa'
                          className='fa fa-temperature-high prefix'
                        ></i>
                        <SensorSelect changed={this.changeHandler} />
                      </div>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md='4'>
                      <MDBInput
                        label='value A'
                        icon='cogs'
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='calA'
                        success='right'
                        value={this.state.calibration.calA}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='4'>
                      <MDBInput
                        label='Value B'
                        icon=''
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='calB'
                        success='right'
                        value={this.state.calibration.calB}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='4'>
                      <MDBInput
                        label='Value C'
                        icon=''
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='calC'
                        success='right'
                        value={this.state.calibration.calC}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md='6'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-phone prefix'></i>
                        <input
                          data-test='input'
                          name='validFrom'
                          type='date'
                          value={this.formatDate(
                            this.state.calibration.validFrom
                          )}
                          onChange={this.changeHandler}
                          className='form-control validate'
                          //value={this.calibration.validFrom}
                        />
                        <label data-error='wrong' data-success='right'>
                          Valid From
                        </label>
                      </div>
                    </MDBCol>
                    <MDBCol md='6'>
                      <div className='md-form form-group'>
                        <i data-test='fa' className='fa fa-phone prefix'></i>
                        <input
                          data-test='input'
                          name='validTo'
                          type='date'
                          onChange={this.changeHandler}
                          className='form-control validate'
                          value={this.formatDate(
                            this.state.calibration.validTo
                          )}
                        />
                        <label data-error='wrong' data-success='right'>
                          Valid To
                        </label>
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
                onClick={this.deletecalibration}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createcalibration}
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

export default calibrations;
