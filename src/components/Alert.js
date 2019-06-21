import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, Modal, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native';
var{width,height} = Dimensions.get('window');

export default class AlertModal extends Component{
    static propTypes = {
        visible : PropTypes.bool,
        headerColor : PropTypes.string,
        title : PropTypes.string,
        body : PropTypes.string,
        close : PropTypes.func 
    }

    render () {
        return (
         <Modal animationType = {"fade"} transparent   = {true} visible  = {this.props.visible} onRequestClose ={()=>""}>
            <TouchableWithoutFeedback>
                <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)', justifyContent : 'center', alignItems : 'center'}}>
                <TouchableWithoutFeedback>
                    <View style={{backgroundColor : 'white', borderTopLeftRadius : 5, borderTopRightRadius : 5, width : width-50, paddingBottom : 10}}>
                        <View style={{height : 35, width : width-50, borderTopLeftRadius : 5, borderTopRightRadius : 5 , backgroundColor : this.props.headerColor}}>
                            <Text style={{color : 'white', fontSize : 18, textAlign : 'center', marginTop : 5, fontFamily : 'ubuntumedium'}}>{this.props.title}</Text>
                        </View>
                        <View style={{padding : 10}}>
                            <Text style={{fontSize : 18, fontFamily : 'ubuntulight',}}>{this.props.body}</Text>
                        </View>
                        <View style={{flexDirection : 'row', width : width-50, alignItems : 'center', justifyContent : 'center'}}>
                            <TouchableOpacity onPress={this.props.close} style={{backgroundColor : this.props.headerColor, height : 30, width : 70, justifyContent : 'center', alignItems : 'center', padding : 10}}>
                            <Text style={{color : 'white', fontSize : 18, fontFamily : 'ubuntumedium'}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
        );
    }
}