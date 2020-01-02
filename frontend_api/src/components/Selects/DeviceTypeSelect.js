import React, { Component } from 'react';

class deviceTypeSelect extends Component {
  state = {
    deviceTypes: []
  };

  componentDidMount() {
    this.fetchdeviceTypes();
  }

  fetchdeviceTypes() {
    fetch('http://localhost:3000/deviceTypes', {
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
      .then(async resData => {
        const deviceTypes = resData;
        await this.setState({ deviceTypes: deviceTypes });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const deviceTypes = this.state.deviceTypes.map(deviceType => {
      return (
        <option key={deviceType._id} value={deviceType._id}>
          {deviceType.name}
        </option>
      );
    });
    return (
      <select
        name='deviceTypeId'
        onChange={this.props.changed}
        className='custom-select form-control beautySelect'
      >
        <option value=''>Select deviceType</option>
        {deviceTypes}
      </select>
    );
  }
}

export default deviceTypeSelect;
