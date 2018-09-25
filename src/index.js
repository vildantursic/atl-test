import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import '../index.css';

const App = () => (
  <div className="App">
    <img className="App-Logo" src={logo} alt="Atlas AI Logo" />
    <h1 className="App-Title">Atlas AI</h1>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
