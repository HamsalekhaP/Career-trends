
const React = require('react');
import {Component} from 'react';
import ReactMapGL,{Marker} from 'react-map-gl';

class DropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.options = props.listSchool;
    this.state = {value: this.options[0]}
    this.viewport = {
      width: 600,
      height: 600,
      latitude: this.state.value['Latitude'],
      longitude: this.state.value['Longitude'],
      zoom: 4,
      mapboxApiAccessToken:"pk.eyJ1IjoibWF0aGlzb25pYW4iLCJhIjoiY2l5bTA5aWlnMDAwMDN1cGZ6Y3d4dGl6MSJ9.JZaRAfZOZfAnU2EAuybfsg"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var selectedSchoolObj = this.options.filter(function(item) {
      return item['School Name'] == event.target.value
    });
    this.setState({value:selectedSchoolObj[0]});
    var latitude = selectedSchoolObj[0]['Latitude'];
    var logitude = selectedSchoolObj[0]['Longitude'];

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
          Pick a school and explore the location around! <select className='drop-down-style' onChange={this.handleChange}>
            {modified_options}
          </select>
        </label>
        <ReactMapGL
          {...this.viewport} 
          onViewportChange={(viewport) => this.setState({viewport})}>
          <Marker latitude={this.viewport.latitude} longitude={this.viewport.longitude}>
          <img src="./static/images/pop.svg" width='20' height='20'/>
          <div className='label-wrap'>{this.state.value['School Name']}</div>
        </Marker>
          </ReactMapGL>
      </div>
    );
  }
}

module.exports = DropdownComponent