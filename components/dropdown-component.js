
const React = require('react');
import {Component} from 'react';

class DropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.options=props.listSchool    
    this.state = this.options[0]
    this.props.updateProps({
      returnCoordinates: [this.state['Latitude'],this.state['Longitude']]
    })
    // console.log('state',this.state)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    var selectedSchoolObj = this.options.filter(function(item) {
      return item['School Name'] == event.target.value
    })    
    this.props.updateProps({
      returnCoordinates: [selectedSchoolObj[0]['Latitude'],selectedSchoolObj[0]['Longitude']]
    })
    
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    let modified_options = this.options.map(d => <option key={d['Index']}>{d['School Name']}</option>)
    return (
        <label>
          Pick a school:
          <select value={this.state.value} onChange={this.handleChange}>
            {modified_options}
          </select>
        </label>
    );
  }
}

module.exports = DropdownComponent