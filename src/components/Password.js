import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
var{width,height} = Dimensions.get('window');
import {Icon} from 'native-base';

export default class Password extends Component{
    static propTypes = {
        title : PropTypes.string,
        underlineColor : PropTypes.string,
        placeholder : PropTypes.string,
        placeholderTextColor : PropTypes.string,
        onChangeText : PropTypes.func,
        eyePress : PropTypes.func,
        style : PropTypes.object,
        password : PropTypes.bool
    }

    render () {
        return (
          <View style={{width : width}}>
            <View style={{width : width-40, alignSelf : 'center'}}>
                <Text style={[styles.label]}>{this.props.title}</Text>
                <TextInput 
                  secureTextEntry={this.props.password}  
                  onChangeText={this.props.onChangeText} 
                  underlineColorAndroid={this.props.underlineColor} 
                  style={[styles.sandi, this.props.style]} 
                  placeholder={this.props.placeholder}  
                  placeholderTextColor={this.props.placeholderTextColor}
                />
                <View style={{  position : 'absolute', height : 50, width : 30, justifyContent : "center", right : 0,zIndex : 1, elevation : 5, bottom : 5}}>
                    <TouchableOpacity 
                      onPress={this.props.eyePress} style={{width : '100%', height : '100%', justifyContent : 'center'}}>
                        <Icon 
                          style={{fontSize : 30, color : 'gray'}} 
                          name={this.props.password ? "ios-eye-off" : 'ios-eye'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  sandi : {
    width : "100%",
    fontSize : 16, 
    paddingRight : 45, 
    height : 45, 
    textAlignVertical : 'center',
    marginBottom : 10,
    zIndex : 1,
    backgroundColor : 'rgba(255,255,255,0.5)' 
  },
  label : {
    marginLeft : 3,
    fontSize : 16,
    fontWeight : 'bold',
  },
});
