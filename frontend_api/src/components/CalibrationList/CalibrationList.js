import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const CalibrationList = props => {
  const calibration = props.calibrations.map(calibration => {
    const values = (
      <p>
        A: {calibration.values.calA}
        <br />
        B: {calibration.values.calB}
        <br />
        C: {calibration.values.calC}
        <br />
      </p>
    );
    if (!calibration.sensor) {
      calibration.sensor = { uniqueId: 'no sensor' };
    }
    const validFrom = new Date(
      calibration.values.validFrom
    ).toLocaleDateString();
    const validTo = new Date(calibration.values.validTo).toLocaleDateString();
    return {
      id: calibration.certificateNumber,
      sensor: calibration.sensor.uniqueId,
      values: values,
      validFrom: validFrom,
      validTo: validTo,
      edit: (
        <div className='tableCentered'>
          <MDBBtn
            color='green darken-2'
            onClick={props.onEdit.bind(this, calibration._id)}
            outline
            size='sm'
          >
            Edit
          </MDBBtn>
          <MDBBtn
            color='red darken-2'
            onClick={props.onDelete.bind(this, calibration._id)}
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
        label: 'Sensor',
        field: 'sensor',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Values',
        field: 'values',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Valid From',
        field: 'validFrom',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Valid To',
        field: 'validTo',
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
    rows: calibration
  };

  return <MDBDataTable striped bordered small btn data={data} />;
};

export default CalibrationList;
