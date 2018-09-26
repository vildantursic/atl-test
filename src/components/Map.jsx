import React from 'react';
import ReactMapGL from 'react-map-gl';

import config from '../../config';

export default class Map extends React.Component {
  render() {
    const { viewportData, setNewViewport } = this.props;
    return (
      <div>
        <ReactMapGL
          mapboxApiAccessToken={config.mapboxToken}
          {...viewportData}
          onViewportChange={viewport => setNewViewport(viewport)}
        />
      </div>
    );
  }
}
