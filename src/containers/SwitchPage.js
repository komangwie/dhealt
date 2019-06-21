import React, {Component} from 'react';
import {
    View, 
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class SwitchPage extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {    
        super(props);
        this._bootstrapAsync();
      }
    
      // Fetch the token from storage then navigate to our appropriate place
      _bootstrapAsync = async () => {
        const tiket = await AsyncStorage.getItem('tiket');
    
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(tiket ? 'App' : 'Auth');
      };
    
      // Render any loading content that you like here
      render() {
        return (
          <View>
          </View>
        );
      }
}