import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Drawer, Button, List } from 'antd';

import MapView from './pages/MapView';

class App extends Component {
  state = {
    visible: false,
    routes: [
      { name: 'Map', link: '/' },
    ],
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { visible, routes } = this.state;

    return (
      <div className="App">
        <Router>
          <div>
            <Drawer
              title="Settings"
              placement="right"
              closable={false}
              onClose={this.onClose}
              visible={visible}
            >
              <List
                dataSource={routes}
                renderItem={
                    item => (<List.Item><Link to={item.link}>{item.name}</Link></List.Item>)
                  }
              />
            </Drawer>
            <div>
              <Button
                type="primary"
                shape="circle"
                icon="setting"
                className="menu-button"
                onClick={this.showDrawer}
              />

              <Route exact path="/" component={MapView} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
