import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const DatatablePage = props => {
  const devices = props.devices.map(device => {
    const config = (
      <p>
        Periodicity: {device.config.periodicity}
        <br />
        Server: {device.config.server}
        <br />
        Port: {device.config.port}
        <br />
      </p>
    );
    if (!device.deviceType) {
      device.deviceType = { name: 'No device type set' };
    }
    if (!device.organisation) {
      device.organisation = { name: 'No connected organisation' };
    }
    if (!device.sensor) {
      device.sensor = { name: 'No connected sensor' };
    }
    return {
      id: device.uniqueId,
      name: device.name,
      type: device.deviceType.name,
      description: device.description,
      configuration: config,
      organisation: device.organisation.name,
      sensor: device.sensor.name,
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, device._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, device._id)}
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
        label: 'Device Type',
        field: 'deviceType',
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
        label: 'Configuration',
        field: 'configuration',
        sort: 'asc',
        width: 100
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
    rows: devices
  };

  return <MDBDataTable striped bordered small btn data={data} />;
};

export default DatatablePage;
