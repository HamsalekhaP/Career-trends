
const React = require('react');
import {Component} from 'react';
import {MapComponent} from './map-component';
import ReactMapGL from 'react-map-gl';

class DropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.options = props.listSchool;
    this.state = this.options[0];
    
    this.props.updateProps({
      returnCoordinates: [
        this.state['Latitude'],
        this.state['Longitude']
      ]
    })
    
    this.viewport = {
      width: 400,
      height: 400,
      latitude: this.state['Latitude'],
      longitude: this.state['Longitude'],
      zoom: 4,
      mapboxApiAccessToken:"pk.eyJ1IjoibWF0aGlzb25pYW4iLCJhIjoiY2l5bTA5aWlnMDAwMDN1cGZ6Y3d4dGl6MSJ9.JZaRAfZOZfAnU2EAuybfsg"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    var selectedSchoolObj = this.options.filter(function(item) {
      return item['School Name'] == event.target.value
    });
    console.log(selectedSchoolObj);
    var latitude = selectedSchoolObj[0]['Latitude'];
    var logitude = selectedSchoolObj[0]['Longitude'];

    this.props.updateProps({
      returnCoordinates: [latitude, logitude]
    })
    this.viewport.latitude = latitude;
    this.viewport.longitude = logitude;
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    let modified_options = this.options.map(d => <option key={d['Index']}>{d['School Name']}</option>)
    return (
      <div>
        <label>
          Pick a school:
          <select value={this.state.value} onChange={this.handleChange}>
            {modified_options}
          </select>
        </label>
        <ReactMapGL
          {...this.viewport} 
          onViewportChange={(viewport) => this.setState({viewport})}
        />
      </div>
    );
  }
}

module.exports = DropdownComponent