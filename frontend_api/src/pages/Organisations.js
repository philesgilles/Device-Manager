import React, { Component } from 'react';
import Spinner from '../components/Core/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import OrganisationList from '../components/OrganisationList/OrganisationList';
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
//import Modal from '../components/Modal/Modal';
//import Backdrop from '../components/Backdrop/Backdrop';
class organisations extends Component {
  state = {
    modal: false,
    organisations: [],
    isLoading: false,
    selectedOrganisation: null,
    organisation: {},
    edit: false,
    delete: false
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

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
    this.setState({ delete: true, edit: false });
    const selectedOrganisation = this.state.organisations.find(
      e => e._id === id
    );
    let organisation = {
      name: selectedOrganisation.name,
      id: selectedOrganisation._id
    };
    await this.setState({ organisation: organisation, delete: true });
    this.toggle();
  };

  editOrganisation = async id => {
    const selectedOrganisation = this.state.organisations.find(
      e => e._id === id
    );
    let organisation = {
      name: selectedOrganisation.name,
      description: selectedOrganisation.description,
      streetAddress: selectedOrganisation.info.streetAddress,
      streetNumber: selectedOrganisation.info.streetNumber,
      postalCode: selectedOrganisation.info.postalCode,
      country: selectedOrganisation.info.country,
      telephone: selectedOrganisation.info.telephone,
      email: selectedOrganisation.info.email,
      id: selectedOrganisation._id
    };
    await this.setState({
      organisation: organisation,
      edit: true,
      delete: false
    });
    this.toggle();
  };

  componentDidMount() {
    this.fetchOrganisations();
  }

  fetchOrganisations = () => {
    this.setState({ isLoading: true });
    fetch('http://localhost:3000/organisations', {
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
        const organisations = resData;
        if (this.isActive) {
          this.setState({ organisations: organisations, isLoading: false });
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

  createOrganisation = () => {
    let organisation = this.state.organisation;
    let method, url;
    let requestBody = {
      name: organisation.name,
      description: organisation.description,
      info: {
        telephone: organisation.telephone,
        email: organisation.email,
        streetAddress: organisation.streetAddress,
        streetNumber: organisation.streetNumber,
        postalCode: organisation.postalCode,
        country: organisation.country
      }
    };
    if (this.state.edit) {
      url = 'http://localhost:3000/organisations/' + organisation.id;
      method = 'PATCH';
    } else {
      url = 'http://localhost:3000/organisations';
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
        if (this.state.edit) {
          this.fetchOrganisations();
          this.toggle();
        } else {
          this.state.organisations.push(resData);
          this.toggle();
        }
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  deleteOrganisation = () => {
    fetch('http://localhost:3000/organisations/' + this.state.organisation.id, {
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
        this.fetchOrganisations();
        this.toggle();
        this.setState({ delete: false, organisation: {} });
      })
      .catch(err => {
        console.log(err);
        this.toggle();
      });
  };

  changeHandler = ({ target }) => {
    let organisation = this.state.organisation;
    organisation[target.name] = target.value;
    this.setState({ organisation });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <OrganisationList
            //authUserId={this.context.userId}
            organisations={this.state.organisations}
            onEdit={this.editOrganisation}
            onDelete={this.deleteHandler}
          />
        )}
        <MDBBtn color='green darken-2' onClick={this.toggle}>
          <i className='fas fa-plus'></i> Add
        </MDBBtn>
        <MDBModal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.state.delete ? 'Delete' : this.state.edit ? 'Edit' : 'Add'}{' '}
            Organisation
          </MDBModalHeader>
          <MDBModalBody>
            {this.state.delete ? (
              <h5 className='tableCentered'>
                Are you sure you want to delete{' '}
                <b>{this.state.organisation.name}</b>
              </h5>
            ) : (
              <form>
                <div className='grey-text'>
                  <MDBInput
                    label='Organisation Name'
                    icon='building'
                    name='name'
                    group
                    type='text'
                    validate
                    error='wrong'
                    success='right'
                    value={this.state.organisation.name}
                    onChange={this.changeHandler}
                  />
                  <MDBInput
                    label='Telephone'
                    icon='phone'
                    group
                    type='number'
                    validate
                    error='wrong'
                    name='telephone'
                    success='right'
                    value={this.state.organisation.telephone}
                    onChange={this.changeHandler}
                  />
                  <MDBInput
                    label='Email'
                    icon='at'
                    group
                    type='email'
                    validate
                    error='wrong'
                    name='email'
                    success='right'
                    value={this.state.organisation.email}
                    onChange={this.changeHandler}
                  />
                  <MDBRow>
                    <MDBCol md='9'>
                      <MDBInput
                        label='Street Address'
                        icon='envelope'
                        group
                        type='text'
                        validate
                        error='wrong'
                        name='streetAddress'
                        success='right'
                        value={this.state.organisation.streetAddress}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                    <MDBCol md='3'>
                      <MDBInput
                        label='N°'
                        icon=''
                        group
                        type='number'
                        validate
                        error='wrong'
                        name='streetNumber'
                        success='right'
                        value={this.state.organisation.streetNumber}
                        onChange={this.changeHandler}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    label='Postal Code'
                    icon='number'
                    group
                    type='number'
                    validate
                    error='wrong'
                    name='postalCode'
                    success='right'
                    value={this.state.organisation.postalCode}
                    onChange={this.changeHandler}
                  />
                  <MDBInput
                    label='Country'
                    icon='number'
                    group
                    type='text'
                    validate
                    error='wrong'
                    name='country'
                    success='right'
                    value={this.state.organisation.country}
                    onChange={this.changeHandler}
                  />
                  <MDBInput
                    type='textarea'
                    rows='2'
                    label='Description / Informations'
                    name='description'
                    icon='info'
                    value={this.state.organisation.description}
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
                onClick={this.deleteOrganisation}
                color='red darken-2'
              >
                Delete
              </MDBBtn>
            ) : (
              <MDBBtn
                type='submit'
                onClick={this.createOrganisation}
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

export default organisations;
