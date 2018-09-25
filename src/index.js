import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

// styles
import 'antd/dist/antd.css';
import './styles/App.scss';

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
