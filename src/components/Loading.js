import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Modal, TouchableWithoutFeedback,  Dimensions } from 'react-native';
var{width,height} = Dimensions.get('window');
import {SkypeIndicator} from 'react-native-indicators';

export default class Loading extends Component{
    static propTypes = {
        visible : PropTypes.bool,
        loadingColor : PropTypes.string,
        loadingTextColor : PropTypes.string
    }

    render () {
        return (
        <Modal animationType = {"fade"} transparent   = {true} visible  = {this.props.visible} onRequestClose ={()=>""}>
            <TouchableWithoutFeedback >
              <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)', justifyContent : 'center'}}>
                <TouchableWithoutFeedback>
                  <View style={{backgroundColor : 'white', height : 80, width : width-100, alignSelf : 'center', justifyContent : 'center', alignItems : 'center', flexDirection : 'row'}}>
                    <View >
                      <SkypeIndicator color={this.props.loadingColor} size={40} />
                    </View>
                    <Text style={{fontSize : 18, marginLeft : 20, color : this.props.loadingTextColor}}>Mohon Menunggu</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        );
    }
}