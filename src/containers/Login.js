import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, View, 
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image,
    ToastAndroid
} from 'react-native';
import {Container,  Content,Icon, Button ,Thumbnail} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
var{width,height} = Dimensions.get('window');
import SplashScreen from 'react-native-splash-screen';
import TextField from './../components/TextField';
import Password from './../components/Password';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

export default class Login extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
          username : null,
          password : null,
          undisPlayPassword : true,
          selected : false,
          loading : false,
          sucAlert : false,
          sucTitle : '',
          sucBody : '',
          dpr_name : null,
          logo : ''
        }
      }

    componentDidMount() {
        this.getDepartemen();
        SplashScreen.hide();
    }

    getDepartemen=()=>{
        // this.setState({loading : true});
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Perusahaan&language=id&action=getPerusahaanDetail&idunit="+MainStore.IDUnit+"&tiket=")
        .then((res)=>res.json())
        .then((response)=>{
          this.setState({loading : false});
          if(response.status == 'success'){
              this.setState({
                  dpr_name : response.result[0].nama_perusahaan,
                  logo : response.result[0].logo_perusahaan
              });
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

   login=()=>{
        if(this.state.username){
            if(this.state.password){
            this.setState({loading : true});
            fetch(MainStore.domain+"/index.php?user=servicelogin&username="+this.state.username+"&pass="+this.state.password)
            .then((res)=>res.json())
            .then((response)=>{
                // alert(JSON.stringify(response));
                if(response.tiket == null){
                    this.setState({
                        loading : false,
                        sucTitle : "Login Gagal",
                        sucBody : 'Email atau Kata Sandi Salah',
                        sucAlert : true
                    });
                }
                else{
                    AsyncStorage.multiSet([
                        ["tiket", response.tiket],
                        ["username", this.state.username]
                    ]);
                    MainStore.setTiket(response.tiket);
                    // this.getUserInfo(response.tiket);
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                }
            }).catch((err)=>{
                this.setState({loading : false});
                ToastAndroid.showWithGravity(
                'Terjasi Kesalahan, Periksa Sambungan Anda',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
                );
            });
            }
            else{
            // this.sandiTextBox.focus();
            ToastAndroid.showWithGravity(
                'Kata Sandi Tidak Boleh Kosong',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            }
        }
        else{
            // this.emailTextBox.focus();
            ToastAndroid.showWithGravity(
            'email  Tidak Boleh Kosong',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
            );
        }
        }

    render() {
        return (
            <Container>
                <StatusBar
                    backgroundColor = {'#069E15'}
                />
                <Content>
               
                <View style={{justifyContent : 'center', flex : 1, height : height}}>
                    
                    <View style={styles.logowrapper}>
                        <Thumbnail large square style={{width : width*0.285, height : width*0.26}} source={{uri : this.state.logo}}/>
                        <Text style={{fontWeight : 'bold', marginTop : 10,fontSize : 18}}>{this.state.dpr_name ? this.state.dpr_name.toUpperCase() : null}</Text>
                    </View>
                    
                    <TextField 
                        title = {"Username"}
                        style={{color : 'black'}}
                        underlineColor = {"gray"}
                        placeholder ={"Masukkan username"}
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
                    
                    <Button onPress={()=>this.login()} block iconLeft style={{backgroundColor : MainStore.primaryCOlor, width : width-40, alignSelf : 'center', marginTop : 15}}>
                        <Icon name='ios-log-in' />
                        <Text style={{color : 'white', fontSize : 16}}> Masuk</Text>
                    </Button>
                    
                    <View style={{marginTop : 30,alignSelf : 'center', flexDirection : 'row'}}>
                        <Text style={{ fontSize : 18}}>Belum punya akun ?</Text>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Register')}>
                        <Text style={{ fontSize : 18, fontWeight : 'bold', textDecorationLine : 'underline'}}> Daftar</Text>
                        </TouchableOpacity>
                    </View>
                   
                  
                    </View>
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
                    close = {()=>this.setState({sucAlert : false})}
                    />
            
            </Container>
        );
    }
}

const styles = StyleSheet.create({
  logowrapper : {
    marginBottom : 10,
    alignSelf : 'center',
    marginBottom : 50,
    justifyContent : 'center',
    alignItems : 'center'
  },
  linearGradient : {
    width : width,
    height : height,
    position : 'absolute',
    zIndex : -1,
    backgroundColor : 'white'
  },
  logoName : {
      fontSize : 20,
      textAlign : 'center',
      fontWeight : 'bold',
      marginBottom : 50
  },
  email : {
    width : "100%",
    fontSize : 16, 
    paddingLeft : 8, 
    height : 50, 
    textAlignVertical : 'center',
    marginBottom : 10,
  },
  sandi : {
    width : "100%",
    fontSize : 16, 
    paddingLeft : 8,
    paddingRight : 40, 
    height : 50, 
    textAlignVertical : 'center',
    marginBottom : 10,
    zIndex : 1,
  },
  label : {
    marginLeft : 25 ,
    fontSize : 16,
    fontWeight : 'bold',
    color : 'white'
  },
});
