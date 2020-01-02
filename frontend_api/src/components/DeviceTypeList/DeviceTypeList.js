import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const DeviceTypeList = props => {
  const deviceTypes = props.deviceTypes.map(deviceType => {
    return {
      id: deviceType.uniqueId,
      name: deviceType.name,
      description: deviceType.description,
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, deviceType._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, deviceType._id)}
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
        label: 'Id',
        field: 'id',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Description',
        field: 'description',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Edit',
        field: 'edit',
        sort: 'asc',
        width: 150
      }
    ],
    rows: deviceTypes
  };

  return <MDBDataTable striped bordered small btn data={data} />;
};

export default DeviceTypeList;
