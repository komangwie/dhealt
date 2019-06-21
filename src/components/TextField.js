import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, TextInput} from 'react-native';
var{width,height} = Dimensions.get('window');

export default class TextField extends Component{
    static propTypes = {
        title : PropTypes.string,
        underlineColor : PropTypes.string,
        placeholder : PropTypes.string,
        placeholderTextColor : PropTypes.string,
        onChangeText : PropTypes.func,
        style : PropTypes.object,
        tipe : PropTypes.string
    }

    render () {
        return (
          <View style={{width : width}}>
            <View ref={ref=>this.email = ref} style={{width : width-40, alignSelf : 'center'}}>
                <Text style={styles.label}>{this.props.title}</Text>
                <TextInput 
                  onChangeText={this.props.onChangeText} 
                  underlineColorAndroid={this.props.underlineColor} 
                  style={[styles.textField,this.props.style]} 
                  keyboardType={this.props.tipe}
                  placeholder={this.props.placeholder} 
                  placeholderTextColor={this.props.placeholderTextColor} />
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  textField : {
    width : "100%",
    fontSize : 16, 
    height : 45, 
    textAlignVertical : 'center',
    marginBottom : 10,
    backgroundColor : 'rgba(255,255,255,0.5)'
  },
  label : {
    marginLeft : 3,
    fontSize : 16,
    fontWeight : 'bold',
  },
});
