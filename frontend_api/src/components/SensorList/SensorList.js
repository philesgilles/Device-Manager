import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const sensorList = props => {
  const sensor = props.sensors.map(sensor => {
    if (!sensor.linkedEquipment) {
      sensor.linkedEquipment = { uniqueId: 'No linked Equipment' };
    }
    if (!sensor.linkedDevice) {
      sensor.linkedDevice = { uniqueId: 'No linked Device' };
    }
    if (!sensor.calibrations.certificateNumber) {
      sensor.calibrations = [{ certificateNumber: 'No calibration' }];
    }
    let calibrations = '';
    sensor.calibrations.forEach(calibration => {
      calibrations += calibration.certificateNumber + ', ';
    });
    return {
      id: sensor.uniqueId,
      type: sensor.type,
      description: sensor.description,
      linkedDevice: sensor.linkedDevice.uniqueId,
      linkedEquipment: sensor.linkedEquipment.uniqueId,
      calibrations: calibrations,
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, sensor._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, sensor._id)}
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
        label: 'Type',
        field: 'type',
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
        label: 'Linked Device',
        field: 'linkedDevice',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Linked Equipment',
        field: 'linkedEquipment',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Calibrations',
        field: 'calibrations',
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
    rows: sensor
  };

  return <MDBDataTable striped bordered small btn data={data} />;
};

export default sensorList;
