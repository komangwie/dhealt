import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, View, 
    Dimensions,
    ToastAndroid
} from 'react-native';
import {Container, Content,Icon, Button , Header, Left, Right, Title,} from 'native-base';
var{width,height} = Dimensions.get('window');
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import TextField from './../components/TextField';
import Password from './../components/Password';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

export default class Register extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            noRekamMedis : null,
            noHp : null,
            username : null,
            password : null,
            konfirmasiPassword : null,
            undisPlayPassword : true,
            undisPlayRepassword : true,
            message : '',
            status : '',
            loading : false,
            sucAlert : false,
            sucTitle : '',
            sucBody : '',
            modal_status : false,
            done : false
        }
      }


   daftar=()=>{
       //dhealth.id/?pagetype=service&page=Web-Service-Register&language=id
       this.setState({loading : true});
       fetch(MainStore.domain+"/?pagetype=service&page=Web-Service-Register&language=id&action=registerRM&idunit="+MainStore.IDUnit,{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                uname : this.state.username,
                password : this.state.password,
                repassword : this.state.konfirmasiPassword,
                nohp : this.state.noHp,
                pas_norm : this.state.noRekamMedis,
                uk_id : "FK201900001"
            })
        }).then((response)=>response.json()).then((res)=>{
            // alert(JSON.stringify(res));
            if(res.status == 'failed'){
            this.setState({
                loading : false,
                sucTitle : "Gagal",
                sucBody : res.message,
                sucAlert : true,
                done : false
            });
            }
            else if(res.status == 'error'){
                this.setState({
                    loading : false,
                    sucTitle : res.title,
                    sucBody : res.message,
                    sucAlert : true,
                    done : false
                });
                }
            else if(res.status == 'success'){
                this.setState({
                    loading : false,
                    sucTitle : res.title,
                    sucBody : res.message,
                    sucAlert : true,
                    done : true
                });
            }
            else if(res.status == 'denied'){
                this.setState({
                    loading : false,
                    sucTitle : res.title,
                    sucBody : res.message,
                    sucAlert : true,
                    done : false
                });
            }
        }).catch((err)=>{
            this.setState({loading : false});
            ToastAndroid.showWithGravity(
            'Terjadi kesalahan',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            );
        });  
    }

    doneState=()=>{
        this.setState({
            sucAlert : false
        },()=>{
            if(this.state.done){
                fetch(MainStore.domain+"/index.php?user=servicelogin&username="+this.state.username+"&pass="+this.state.password)
                .then((res)=>res.json())
                .then((response)=>{
                    AsyncStorage.multiSet([
                        ["tiket", response.tiket],
                        ["username", this.state.username]
                    ]);
                    MainStore.setTiket(response.tiket);
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                      });
                      this.props.navigation.dispatch(resetAction);
                }).catch((err)=>{
                    this.setState({loading : false});
                    ToastAndroid.showWithGravity(
                    'Terjasi Kesalahan, Periksa Sambungan Anda',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                    );
                });
            }
        });
    }

    render() {
        return (
            <Container>
                <Header androidStatusBarColor={MainStore.statusbarColor} style={{backgroundColor : MainStore.primaryCOlor}}>
                    <Left>
                    <Button transparent onPress={()=>this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                    </Left>
                    <View style={{height : '100%', justifyContent : 'center'}}>
                         <Title>Pendaftaran Akun</Title>
                    </View>
                    <Right/>
                </Header>
                <Content >
                    <View style={{marginTop : 40}}></View>
                    <TextField 
                        title = {"Nomor rekam medis"}
                        style={{color : 'black'}}
                        underlineColor = {"gray"}
                        placeholder ={"Masukkan nomor rekam medis terdaftar"}
                        placeholderTextColor = {'gray'}
                        onChangeText ={(text)=>this.setState({noRekamMedis : text})}
                        tipe="numeric"
                    />      

                    <TextField 
                        title = {"No Hp / Nama"}
                        style={{color : 'black'}}
                        underlineColor = {"gray"}
                        placeholder ={"Masukkan no hp / nama pasien"}
                        placeholderTextColor = {'gray'}
                        onChangeText ={(text)=>this.setState({noHp : text})}
                    />          

                     <TextField 
                        title = {"Username"}
                        style={{color : 'black'}}
                        underlineColor = {"gray"}
                        placeholder ={"Masukkan username pasien"}
                        placeholderTextColor = {'gray'}
                        onChangeText ={(text)=>this.setState({username : text})}
                    />               

                    <Password
                        password = {this.state.undisPlayPassword}
                        title = {"Password"}
                        style={{color : 'black'}}
                        underlineColor = {"gray"}
                        placeholder ={"Masukkan password"}
                        placeholderTextColor = {'gray'}
                        onChangeText ={(text)=>this.setState({password : text})}
                        eyePress = {()=>this.setState({undisPlayPassword : !this.state.undisPlayPassword})}
                    />     

                    <Password
                        password = {this.state.undisPlayRepassword}
                        title = {"Konfirmasi Password"}
                        style={{color : 'black'}}
                        underlineColor = {"gray"}
                        placeholder ={"Ulangi masukkan password"}
                        placeholderTextColor = {'gray'}
                        onChangeText ={(text)=>this.setState({konfirmasiPassword : text})}
                        eyePress = {()=>this.setState({undisPlayRepassword : !this.state.undisPlayRepassword})}
                    />     

                    <Button onPress={()=>this.daftar()} block iconLeft style={{backgroundColor : MainStore.primaryCOlor, width : width-40, alignSelf : 'center', marginTop : 15, marginBottom : 10}}>
                        <Icon name='ios-log-in' />
                        <Text style={{color : 'white', fontSize : 16}}> Daftar</Text>
                    </Button>
                    
                </Content>
                <Loading 
                    visible={this.state.loading}
                    loadingColor ={MainStore.primaryCOlor}
                    loadingTextColor = "gray"
                />
                <AlertModal 
                    visible={this.state.sucAlert}
                    title = {this.state.sucTitle}
                    body = {this.state.sucBody}
                    headerColor = {MainStore.primaryCOlor}
                    close = {()=>this.doneState()}
                    />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
linearGradient : {
    width : width,
    height : height,
    position : 'absolute',
    zIndex : -1,
    backgroundColor : '#069E15'
},
  label : {
    marginLeft : 25 ,
    fontSize : 16,
    fontWeight : 'bold',
    color : 'gray'
  },
  picker : { 
    width: width-40, 
    borderBottomWidth : 1,
    borderBottomColor : 'gray',
    color : 'gray',
    height : 50, 
    fontSize : 18,
    marginBottom : 10,
    alignSelf : 'center'
  },
  headerBar :{
    height : 60,
    width : width,
    flexDirection : 'row',
    alignItems : 'center',
    paddingLeft : 10
  },
});
