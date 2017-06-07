/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
} from 'react-native';
import AddressView from './AddressView'

export default class AddressSelect extends Component {
    render() {
        return (
            <AddressView/>
        );
    }
}

AppRegistry.registerComponent('AddressSelect', () => AddressSelect);
