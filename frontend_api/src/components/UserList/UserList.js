import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const UserList = props => {
  const users = props.users.map(user => {
    if (!user.organisation) {
      user.organisation = { name: 'No connected organisation' };
    }
    return {
      username: user.username,
      email: user.email,
      name: user.info.firstname + ' ' + user.info.lastname,
      telephone: user.info.telephone,
      organisation: user.organisation.name,
      password: (
        <div className='tableCentered'>
          <i className='fa fa-key fa-lg'></i>
        </div>
      ),
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, user._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, user._id)}
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
        label: 'Username',
        field: 'username',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Email',
        field: 'email',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Telephone',
        field: 'telephone',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Organisation',
        field: 'organisation',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Change password',
        field: 'password',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Edit',
        field: 'edit',
        sort: 'asc',
        width: 150
      }
    ],
    rows: users
  };

  return <MDBDataTable responsive striped bordered small btn data={data} />;
};

export default UserList;
