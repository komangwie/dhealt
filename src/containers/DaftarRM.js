import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, View, 
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import {Container, Label, Content,Icon, Button ,Thumbnail, Picker, Header, Left, Body, Right, Title,} from 'native-base';
var{width,height} = Dimensions.get('window');
import {SkypeIndicator} from 'react-native-indicators';
import { StackActions, NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import TextField from './../components/TextField';
import Password from './../components/Password';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

export default class DaftarRM extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            noRekamMedis : null,
            noHp : null,
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


   async daftar(){
       this.setState({loading : true});
       const uname = await AsyncStorage.getItem('username');
       fetch(MainStore.domain+'/?pagetype=service&page=Web-Service-Tambahkan-Peserta&language=id&tiket='+MainStore.tiket,{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                nohp : this.state.noHp,
                pas_norm : this.state.noRekamMedis,
                uk_id : "FK201900001",
                uname : uname
            })
        }).then((response)=>response.json()).then((res)=>{
            // alert(JSON.stringify(res));
            // var b = JSON.parse(res);
         if(res.status == 'failed'){
         this.setState({
             loading : false,
             sucTitle : res.status,
             sucBody : res.message,
             sucAlert : true,
             done : false
         });
         }
         else if(res.status == "error"){
          this.setState({
              loading : false,
              sucTitle : res.status,
              sucBody : res.message,
              sucAlert : true,
              done : false
          });
         }
         else if(res.status == "success"){
          this.setState({
              loading : false,
              sucTitle : res.status,
              sucBody : res.message,
              sucAlert : true,
              done : true
          });
         }
         else if(res.status == "denied"){
          this.setState({
            loading : false,
            done : false
           });
           this.props.navigation.replace('Login');
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

    gotoHome=()=>{
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
            ],
            });
            this.props.navigation.dispatch(resetAction);
    }

    doneState=()=>{
        this.setState({
            sucAlert : false
        },()=>{
            if(this.state.done){
                this.setState({loading : true});
                fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-User&language=id&tiket="+MainStore.tiket+"&action=getPasienList&idunit="+MainStore.IDUnit)
                .then((res)=>res.json())
                .then((response)=>{
                // alert(JSON.stringify(response));
                this.setState({loading : false});
                if(response.status == 'success'){
                    MainStore.setPasien(response.result);
                    this.props.navigation.goBack();
                }
                else if(response.status == 'error'){
                    this.setState({
                    sucTitle : response.title,
                    sucBody : response.message,
                    sucAlert : true
                    });
                }
                else if(response.status == 'failed'){
                    this.setState({
                    sucTitle : response.title,
                    sucBody : response.message,
                    sucAlert : true
                    });
                }
                else if(response.status == 'denied'){
                    this.props.navigation.navigate('Auth');
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
                         <Title>Daftar RM</Title>
                    </View>
                    <Right/>
                </Header>
                <Content >
                    <View style={{marginTop : 40}}></View>
                    <TextField 
                        title = {"Nomor Rekam Medis"}
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

                   
                    <Button onPress={()=>this.daftar()} block iconLeft style={{backgroundColor : MainStore.primaryCOlor, width : width-40, alignSelf : 'center', marginTop : 15, marginBottom : 10}}>
                        <Icon name='brush' />
                        <Text style={{color : 'white', fontSize : 16}}> Daftarkan Peserta</Text>
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
