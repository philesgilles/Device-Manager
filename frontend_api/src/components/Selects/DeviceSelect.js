import React, { Component } from 'react';

class DeviceSelect extends Component {
  state = {
    devices: []
  };

  componentDidMount() {
    this.fetchdevices();
  }

  fetchdevices() {
    fetch('http://localhost:3000/devices', {
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
        const devices = resData;
        await this.setState({ devices: devices });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const devices = this.state.devices.map(device => {
      return (
        <option key={device._id} value={device._id}>
          {device.uniqueId}
        </option>
      );
    });
    return (
      <select
        name='deviceId'
        onChange={this.props.changed}
        className='custom-select form-control beautySelect'
      >
        <option value=''>Select device</option>
        {devices}
      </select>
    );
  }
}

export default DeviceSelect;
