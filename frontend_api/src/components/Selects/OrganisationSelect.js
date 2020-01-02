import React, { Component } from 'react';

class organisationSelect extends Component {
  state = {
    organisations: []
  };

  componentDidMount() {
    this.fetchOrganisations();
  }

  fetchOrganisations() {
    fetch('http://localhost:3000/organisations', {
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
        const organisations = resData;
        await this.setState({ organisations: organisations });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const organisations = this.state.organisations.map(organisation => {
      return (
        <option key={organisation._id} value={organisation._id}>
          {organisation.name}
        </option>
      );
    });
    return (
      <select
        name='organisationId'
        onChange={this.props.changed}
        className='custom-select form-control beautySelect'
      >
        <option value=''>Select organisation</option>
        {organisations}
      </select>
    );
  }
}

export default organisationSelect;
