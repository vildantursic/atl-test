import React from 'react';
import DeckGL, { HexagonLayer } from 'deck.gl';
import { isWebGL2 } from 'luma.gl';
import { StaticMap } from 'react-map-gl';

const initialViewState = {
  longitude: -73.75,
  latitude: 40.73,
  zoom: 6.6,
  pitch: 40.5,
  bearing: -27.396674584323023,
};

const elevationScale = { min: 1, max: 50 };

const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2,
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

class MapView extends React.Component {
  static get defaultColorRange() {
    return colorRange;
  }

  constructor(props) {
    super(props);
    this.state = {
      viewportData: {
        longitude: -73.75,
        latitude: 40.73,
        zoom: 9.6,
        maxZoom: 16,
        pitch: 0,
        bearing: 0,
      },
      disableGPUAggregation: false,
      elevationScale: elevationScale.min,
    };

    this.onInitialized = this.onInitialized.bind(this);
    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this.startAnimate = this.startAnimate.bind(this);
    this.animateHeight = this.animateHeight.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.animate();
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.stopAnimate();
  }

  onInitialized(gl) {
    const { disableGPUAggregation } = this.state;

    if (!isWebGL2(gl)) {
      console.warn('GPU aggregation is not supported'); // eslint-disable-line
      if (disableGPUAggregation) {
        console.log('disabled GUP aggregation');
      }
    }
  }

  resize = () => {
    const { viewportData, width, height } = this.state;

    this.setState({
      viewportData: {
        ...viewportData,
        width: width || window.innerWidth,
        height: height || window.innerHeight,
      },
    });
  };

  animate() {
    this.stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = setTimeout(this.startAnimate, 1500);
  }

  startAnimate() {
    this.intervalTimer = setInterval(this.animateHeight, 20);
  }

  stopAnimate() {
    clearTimeout(this.startAnimationTimer);
    clearTimeout(this.intervalTimer);
  }

  animateHeight() {
    const { elevationScale } = this.state;
    if (elevationScale === 15) {
      this.stopAnimate();
    } else {
      this.setState({ elevationScale: elevationScale + 1 });
    }
  }

  onHover = (event) => {
    console.log(event);
    const { features, srcEvent: { offsetX, offsetY } } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  renderTooltip() {
    const {
      hoveredFeature,
      x,
      y,
    } = this.state;

    return hoveredFeature && (
      <div className="tooltip" style={{ left: x, top: y }}>
        <div>
          Props:
          { hoveredFeature.properties.name }
        </div>
      </div>
    );
  }

  renderLayers() {
    const {
      data = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json',
      radius = 1000,
      upperPercentile = 100,
      coverage = 1,
      gpuAggregation = true,
      onHover,
      elevationScale,
    } = { ...this.props, ...this.state };
     
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data,
        elevationRange: [0, 3000],
        elevationScale,
        extruded: true,
        getPosition: d => d,
        lightSettings: LIGHT_SETTINGS,
        onHover,
        opacity: 1,
        pickable: Boolean(onHover),
        radius,
        upperPercentile,
        gpuAggregation,
      }),
    ];
  }

  render() {
    const {
      baseMap = true,
    } = { ...this.props };

    return (
      <DeckGL
        layers={this.renderLayers()}
        initialViewState={initialViewState}
        onWebGLInitialized={this.onInitialized}
        controller
      >
        {baseMap && (
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing
            mapboxApiAccessToken="pk.eyJ1IjoidmlsZGFudHVyc2ljIiwiYSI6IjF5cnIxNDAifQ.ZwVGbqlH3ncrPBhobjrRpg"
          >
            {this.renderTooltip()}
          </StaticMap>
        )}
      </DeckGL>
    );
  }
}

export default MapView;
