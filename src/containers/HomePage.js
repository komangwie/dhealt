import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, View, 
    Dimensions,
    DrawerLayoutAndroid,
    Image,
    ToastAndroid,
    Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Content,Icon, Button ,Thumbnail,  Header, Left, Body, Right, Title,Item} from 'native-base';
var{width,height} = Dimensions.get('window');
import {observer} from 'mobx-react';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

@observer
export default class HomePage extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            loading : false,
            sucAlert : false,
            sucTitle : '',
            sucBody : '',
            dpr_name : null,
            dpr_hp : null,
            logo : '',
            dpr_alamat : null
        }
        this._getTiket();
      }
    _getTiket = async () => {
        const tiket = await AsyncStorage.getItem('tiket');
        MainStore.setTiket(tiket);
    };
 
    componentDidMount(){
        SplashScreen.hide();
        MainStore.getTiket();
        setTimeout(() => {
            this.getDepartemen();
        }, 0);
    }

    getDepartemen=()=>{
        this.setState({loading : true});
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Perusahaan&language=id&action=getPerusahaanDetail&idunit="+MainStore.IDUnit+"&tiket=")
        .then((res)=>res.json())
        .then((response)=>{
          this.setState({loading : false});
          if(response.status == 'success'){
              this.setState({
                  dpr_name : response.result[0].nama_perusahaan,
                  dpr_hp : response.result[0].telepon_perusahaan,
                  dpr_alamat : response.result[0].alamat_perusahaan,
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

    logout=()=>{
      Alert.alert(
        'Logout',
        'Apakah Anda yakin ingin Logout?',
        [
          {
            text: 'Tidak',
            onPress: () =>null,
            style: 'cancel',
          },
          {text: 'Ya', onPress: () => {
           this.logoutTrue();
          }
        },
        ],
        {cancelable: false},
      );
    }

    logoutTrue = async () => {
      let keys = ['tiket', 'username'];
      let a = await AsyncStorage.multiRemove(keys, (err) => {
        MainStore.getTiket();
        // this.props.navigation.navigate("Auth");
      });
  };

    render() {
        var navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
              <View style={{width : '100%', padding : 10, backgroundColor : MainStore.primaryCOlor, justifyContent : 'center'}}>
                    <Thumbnail medium square style={{width : "22%"}} source={{uri : this.state.logo}}/>
                    <Text style={{color : 'white', fontWeight : 'bold', marginTop : 15}}>{this.state.dpr_name}</Text>
                    <Text style={{color : 'white'}}>{this.state.dpr_hp}</Text>
                    <Text style={{color : 'white'}}>{this.state.dpr_alamat}</Text>
              </View>
              {
                MainStore.tiket ? (
                  <View>
                  <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.props.navigation.navigate('Profil')}>
                      <View style={{width : 40}}>
                        <Icon name="ios-person" style={{color : MainStore.primaryCOlor, fontSize : 35}}/>
                      </View>
                      <Text style={styles.drawerTextMenu}>Pasien Terdaftar</Text>
                  </Item>
                  <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.props.navigation.navigate('Praktek')}>
                      <View style={{width : 40}}>
                        <Image style={{height : 30, width : 28}} source={require("../../assets/images/stateskop.png")}/>
                      </View>
                      <Text style={styles.drawerTextMenu}>Reservasi Online</Text>
                  </Item>
                  <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.props.navigation.navigate('Riwayat')}>
                      <View style={{width : 40}}>
                        <Icon name="md-list" style={{color : MainStore.primaryCOlor, fontSize : 35}}/>
                      </View>
                      <Text style={styles.drawerTextMenu}>Riwayat Pemeriksaan</Text>
                  </Item>
                  
                  </View>
                ) : (
                  <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.props.navigation.navigate('Login')}>
                  <View style={{width : 40}}>
                    <Icon name="log-in" style={{color : MainStore.primaryCOlor, fontSize : 35}}/>
                  </View>
                  <Text style={styles.drawerTextMenu}>Login</Text>
                 </Item>
                )
              }

                  <View>
                    <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.props.navigation.navigate('Jadwal')}>
                      <View style={{width : 40}}>
                        <Icon name="calendar" style={{color : MainStore.primaryCOlor, fontSize : 35}}/>
                      </View>
                      <Text style={styles.drawerTextMenu}>Jadwal praktek</Text>
                    </Item>
                    <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.props.navigation.navigate('PraktekUnLogin')}>
                        <View style={{width : 40}}>
                          <Icon name="people" style={{color : MainStore.primaryCOlor, fontSize : 35}}/>
                        </View>
                        <Text style={styles.drawerTextMenu}>Antrean Pasien</Text>
                    </Item>
                  </View>
             {
               MainStore.tiket ? (
                <Item style={{height : 60, paddingLeft : 10}} onPress={()=>this.logout()}>
                <View style={{width : 40}}>
                  <Icon name="log-out" style={{color : MainStore.primaryCOlor, fontSize : 35}}/>
                </View>
                <Text style={styles.drawerTextMenu}>Logout</Text>
              </Item>
               ) : null
             }
              
            </View>
          );
        return (
            <DrawerLayoutAndroid
            ref = {ref=> this.drawer = ref}
            drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}>
                <Container >
                    <Header androidStatusBarColor={MainStore.statusbarColor} style={{backgroundColor : MainStore.primaryCOlor}}>
                        <Left>
                        <Button transparent onPress={()=>this.drawer.openDrawer()}>
                            <Icon name='menu' />
                        </Button>
                        </Left>
                        <Body>
                            <Title>Beranda</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <View style={styles.logowrapper}>
                        <Thumbnail large square style={{width : width*0.285, height : width*0.26}} source={{uri : this.state.logo}}/>
                        <Text style={{fontWeight : 'bold', marginTop : 10,fontSize : 18}}>{this.state.dpr_name ? this.state.dpr_name.toUpperCase() : null}</Text>
                        <Text style={{fontWeight : 'bold', marginTop : 10,fontSize : 16}}>{this.state.dpr_hp }</Text>
                        <Text style={{fontWeight : 'bold', marginTop : 10,fontSize : 16}}>{this.state.dpr_alamat}</Text>
                    </View>

                    <Text style={{fontSize : 16, textAlign : 'center', marginTop : 40}}>Code & Framework</Text>
                    
                    <View style={{marginTop : 10, alignSelf : 'center', flexDirection : 'row', alignItems : 'center'}}>
                        <Image style={{height : height*0.08, width : height*0.08}} source={require("../../assets/images/cap-djingga-02.png")}/>
                        <Image resizeMode="contain" style={{height : height*0.045, width : width*0.270, marginLeft : 20}} source={require("../../assets/images/logo.png")}/>
                    </View>

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
            </DrawerLayoutAndroid>
            
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
logowrapper : {
  marginBottom : 10,
  alignSelf : 'center',
  marginBottom : 50,
  justifyContent : 'center',
  alignItems : 'center',
  marginTop : height/5
},
  label : {
    marginLeft : 25 ,
    fontSize : 16,
    fontWeight : 'bold',
    color : 'white'
  },
  picker : { 
    width: width-40, 
    borderBottomWidth : 1,
    borderBottomColor : 'white',
    color : 'white',
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
