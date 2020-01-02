import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const DatatablePage = props => {
  const equipments = props.equipments.map(equipment => {
    if (!equipment.sensor) {
      equipment.sensor = { uniqueId: 'No connected sensors' };
    }
    if (!equipment.organisation) {
      equipment.organisation = { name: 'No connected organisation' };
    }
    return {
      id: equipment.uniqueId,
      name: equipment.name,
      description: equipment.description,
      organisation: equipment.organisation.name,
      sensor: equipment.sensor.uniqueId,
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, equipment._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, equipment._id)}
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
        label: 'Organisation',
        field: 'organisation',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Sensor',
        field: 'sensor',
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
    rows: equipments
  };

  return <MDBDataTable striped bordered small btn data={data} />;
};

export default DatatablePage;
