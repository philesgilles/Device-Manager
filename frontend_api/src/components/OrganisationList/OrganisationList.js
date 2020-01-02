import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const DatatablePage = props => {
  const organisations = props.organisations.map(organisation => {
    let address = (
      <p>
        {organisation.info.streetAddress}, {organisation.info.streetNumber}
        <br />
        {organisation.info.postalCode}
        <br />
        {organisation.info.country}
      </p>
    );
    return {
      name: organisation.name,
      description: organisation.description,
      telephone: organisation.info.telephone,
      email: organisation.info.email,
      address: address,
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, organisation._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, organisation._id)}
            outline
            size='sm'
          >
            X
          </MDBBtn>
        </div>
      )
    };
  });
  const data = {
    columns: [
      {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Description',
        field: 'description',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Telephone',
        field: 'telephone',
        width: 150
      },
      {
        label: 'Email',
        field: 'email',
        sort: 'asc'
      },
      {
        label: 'Address',
        field: 'address'
      },
      {
        label: 'Edit',
        field: 'edit'
      }
    ],
    rows: organisations
  };

  return <MDBDataTable responsive striped bordered small btn data={data} />;
};

export default DatatablePage;
