import React, { Component } from 'react';

class SensorSelect extends Component {
  state = {
    sensors: []
  };

  componentDidMount() {
    this.fetchsensors();
  }

  fetchsensors() {
    fetch('http://localhost:3000/sensors', {
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
        const sensors = resData;
        await this.setState({ sensors: sensors });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const sensors = this.state.sensors.map(sensor => {
      return (
        <option key={sensor._id} value={sensor._id}>
          {sensor.uniqueId}
        </option>
      );
    });
    return (
      <select
        name='sensorId'
        onChange={this.props.changed}
        className='custom-select form-control beautySelect'
      >
        <option value=''>Select sensor</option>
        {sensors}
      </select>
    );
  }
}

export default SensorSelect;
