import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Drawer, Button, List } from 'antd';

import MapView from './pages/MapView';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      routes: [
        { name: 'Map', link: '/' },
      ],
    };
  }

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
              title="Links"
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
              <Button style={{ position: 'absolute', zIndex: '100' }} type="primary" onClick={this.showDrawer}>
                  Open
              </Button>
              <Route exact path="/" component={MapView} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
