import React, { Component } from 'react';

class EquipmentSelect extends Component {
  state = {
    equipments: []
  };

  componentDidMount() {
    this.fetchequipments();
  }

  fetchequipments() {
    fetch('http://localhost:3000/equipments', {
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
        const equipments = resData;
        await this.setState({ equipments: equipments });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const equipments = this.state.equipments.map(equipment => {
      return (
        <option key={equipment._id} value={equipment._id}>
          {equipment.uniqueId}
        </option>
      );
    });
    return (
      <select
        name='equipmentId'
        onChange={this.props.changed}
        className='custom-select form-control beautySelect'
      >
        <option value=''>Select equipment</option>
        {equipments}
      </select>
    );
  }
}

export default EquipmentSelect;
