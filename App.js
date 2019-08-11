import React, {Component} from 'react';
import AppNavigator from './screens/init';
import {StatusBar} from 'react-native';
import {Provider} from '@ant-design/react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider>
        <AppNavigator/>
      </Provider>
    );
  }
}

