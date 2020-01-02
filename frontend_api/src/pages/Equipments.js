import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import EquipmentList from '../components/EquipmentList/EquipmentList';
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

class equipments extends Component {
  state = {
    modal: false,
    equipments: [],
    isLoading: false,
    selectedequipment: null,
    equipment: {},
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
    const selectedEquipment = this.state.equipments.find(e => e._id === id);
    let equipment = {
      uniqueId: selectedEquipment.uniqueId,
      id: selectedEquipment._id
    };
    await this.setState({ equipment: equipment, delete: true });
    this.toggle();
  };

  editequipment = async id => {
    const selectedEquipment = this.state.equipments.find(e => e._id === id);
    let equipment = {
      uniqueId: selectedEquipment.uniqueId,
      name: selectedEquipment.name,
      description: selectedEquipment.description,
      organisationId: selectedEquipment.organisationId,
      id: selectedEquipment['_id']
    };
    await this.setState({ equipment: equipment, edit: true });
    this.toggle();
  };

  componentDidMount() {
    this.fetchequipments();
  }

  fetchequipments = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/equipments', {
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
        const equipments = resData;
        if (this.isActive) {
          this.setState({ equipments: equipments, isLoading: false });
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

  createequipment = () => {
    let equipment = this.state.equipment;
    let method, url;
    let requestBody = {
      uniqueId: equipment.uniqueId,
      name: equipment.name,
      description: equipment.description,
      organisationId: equipment.organisationId
    };
    console.log(requestBody);
    if (this.state.edit) {
      delete equipment.password;
      url = 'http://localhost:3000/equipments/' + equipment.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/equipments';
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
        this.fetchequipments();
        this.toggle();
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  deleteequipment = () => {
    fetch('http://localhost:3000/equipments/' + this.state.equipment.id, {
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
        this.fetchequipments();
        this.toggle();
        this.setState({ delete: false, equipment: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let equipment = this.state.equipment;
    equipment[target.name] = target.value;
    this.setState({ equipment });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EquipmentList
            //authequipmentId={this.context.equipmentId}
            equipments={this.state.equipments}
            onEdit={this.editequipment}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            equipment
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete{' '}
                <b>{this.state.equipment.uniqueId}</b>
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
                    value={this.state.equipment.uniqueId}
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
                    value={this.state.equipment.name}
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
                          value={this.state.equipment.organisationId}
                          changed={this.changeHandler}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    type='textarea'
                    rows='2'
                    label='Description / Informations'
                    name='description'
                    icon='info'
                    value={this.state.equipment.description}
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
                onClick={this.deleteequipment}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createequipment}
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

export default equipments;
