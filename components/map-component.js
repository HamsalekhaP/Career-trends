const React = require('react');
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';

class MapComponent extends React.Component {
    state = {
        viewport: {
          width: 400,
          height: 400,
          latitude: this.props.focusCoordinate[0] || 22,
          longitude: this.props.focusCoordinate[1] || 2,
          zoom: 4,
          mapboxApiAccessToken:"pk.eyJ1IjoibWF0aGlzb25pYW4iLCJhIjoiY2l5bTA5aWlnMDAwMDN1cGZ6Y3d4dGl6MSJ9.JZaRAfZOZfAnU2EAuybfsg"
        }
      };
  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    );
  }
}
module.exports = MapComponent;


