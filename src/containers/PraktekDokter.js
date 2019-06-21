import React, {Component} from 'react';
import {
    StyleSheet, 
    View, 
    StatusBar,
    Dimensions,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {Container, Label, Content,Icon, Button ,Thumbnail, Picker, Header, Left, Body, Right, Title, Card, Item} from 'native-base';
var{width,height} = Dimensions.get('window');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SkypeIndicator} from 'react-native-indicators';
import { StackActions, NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import TextField from './../components/TextField';
import Password from './../components/Password';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

export default class PraktekDokter extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            dokter : [],
            dokterTmp : [],
            loading : false,
            sucAlert : false,
            sucTitle : '',
            sucBody : '',
            modal_status : false,
            search : false,
            keyword : null
        }
      }

      componentDidMount(){
        MainStore.getTiket();
        setTimeout(() => {
            this.getJadwalPraktekDokter();
        }, 0);
    }

    getJadwalPraktekDokter=()=>{
        this.setState({loading : true});
        
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Pendaftaran-Online&language=id&action=getJadwalDokter&tiket="+MainStore.tiket+"&idunit="+MainStore.IDUnit)
        .then((res)=>res.json())
        .then((response)=>{
          this.setState({loading : false});
          if(response.status == 'success'){
              this.setState({
                dokter : response.result,
                dokterTmp : response.result
              });
          }
          else if(response.status == 'error'){
            this.setState({
              sucTitle : response.title,
              sucBody : response.message,
              sucAlert : true
            });
          }
          else if(response.status == "notif"){
            this.setState({
              sucTitle : "Notifikasi",
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

    renderPhotoProfile=(jk)=>{
      let cpn = null;
      if(jk == "L"){
        cpn = (
          <Image style={{width : 50, height : 50}} source={require("../../assets/images/male.png")}/>
        );
      }
      else{
        cpn = (
          <Image style={{width : 50, height : 50}} source={require("../../assets/images/female.png")}/>
        );
      }
      return cpn;
    }

    stateCari=()=>{
      this.setState({search : !this.state.search});
      setTimeout(()=>{
        if(this.state.search){
           this.cari.focus();
        }
        else{
          this.cariDokter('');
        }
      },0);
    }

    parseJam=(jam, label_waktu)=>{
      let cpn = null;
      if(jam == "00:00:00"){
        cpn = "SELESAI";
      }
      else{
        cpn = jam.slice(0, 5);
      }
      return cpn;
    }

    cariDokter=(key)=>{
      var newArray = this.state.dokter.filter(function (el) {
          return el.peg_nama.indexOf(key.toUpperCase()) > -1
      });
      this.setState({
          dokterTmp : newArray
      })
  }

  parsetanggal=(jamService)=>{
    let dateService = jamService.slice(0, 10);
    let dateNew = dateService.split('-');
    var mm = ["","JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"]
    dateService = dateNew[2]+" "+mm[parseInt(dateNew[1])]+" "+dateNew[0];
    return dateService;
  }

    render() {
        return (
            <Container style={{backgroundColor : '#ECECEC'}}>
                <Header androidStatusBarColor={MainStore.statusbarColor} style={{backgroundColor : MainStore.primaryCOlor}}>
                    <Left>
                    <Button transparent onPress={()=>this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                    </Left>
                    <View style={{height : '100%', width : width-150, justifyContent : 'center'}}>
                         
                         {
                           this.state.search ? (
                            <TextInput ref={ref=>this.cari = ref} returnKeyType='search'  onChangeText={(text)=>this.cariDokter(text)} underlineColorAndroid="white" style={styles.email} placeholder="Ketik untuk mencari"  placeholderTextColor='rgba(255,255,255,0.5)' />
                            ):(<Title>Reservasi Online</Title>)
                         }
                    </View>
                    <Right style={{width : 50}}>
                      <Button transparent onPress={()=>this.stateCari()}>
                          <Icon name={this.state.search ? 'close' : 'search'}  />
                      </Button>
                    </Right>
                </Header>
                <Content >
                  {
                    this.state.dokter.length > 0 && this.state.dokterTmp.length == 0 ? (
                    <Card style={{justifyContent : 'center', alignItems : 'center', padding : 10}}>
                      <Text>Hasil Tidak Ditemukan</Text>
                    </Card>
                    ):null
                  }
               
                <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                keyExtractor={item=>item.peg_id}
                data = {this.state.dokterTmp}
                renderItem={({ item, index}) => (
                  <View style={{backgroundColor : 'white',marginBottom : 10}}>
                      <View style={{padding : 10, alignItems : 'center', flexDirection : 'row', width : width, backgroundColor : 'rgba(0,158,20,0.2)'}}>
                        {this.renderPhotoProfile(item.peg_jk)}
                        <View style={{width : width-70}}>
                          <Text style={{fontSize : 16,marginLeft : 5,  fontWeight : 'bold', color : MainStore.primaryCOlor}}>{item.peg_nama}</Text>
                          <Text style={{fontSize : 16,marginLeft : 5, fontStyle : 'italic', color : MainStore.primaryCOlor}}>{item.drsp_name}</Text>
                        </View>
                      </View>
                      <View style={{paddingLeft : 15, paddingBottom : 10, borderBottomColor : 'rgba(0,0,0,0.2)', borderBottomWidth : 0.8}}>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Departemen</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{item.dept_name}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Hari, Tanggal</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{item.djp_hari}, {this.parsetanggal(item.tanggal)}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Jam Buka</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{this.parseJam(item.djp_jam_buka, item.pr_label_waktu)} s/d {this.parseJam(item.djp_jam_tutup, item.pr_label_waktu)}</Text>
                            </View>
                        </View>
                      </View>
                      <View style={{width : width, height : 50, flexDirection : 'row', paddingLeft : 20, paddingTop : 10, paddingBottom : 10}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Daftar",{item : item})} style={{height : 30, alignSelf : 'stretch', flex : 1}}>
                          <View style={{flexDirection : 'row',height : 30, alignItems : 'center'}}>
                              <Icon style={{fontSize : 20,color : MainStore.primaryCOlor}} name="brush"/>
                              <Text style={{marginLeft : 5,color : MainStore.primaryCOlor}}>Daftar Sekarang</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Antrean",{item : item})} style={{height : 30, alignSelf : 'stretch', flex : 1}}>
                          <View style={{flexDirection : 'row',height : 30, alignItems : 'center'}}>
                              <Icon style={{fontSize : 20,color : MainStore.primaryCOlor}} name="people"/>
                              <Text style={{marginLeft : 5,color : MainStore.primaryCOlor}}>Lihat Antrean ({item.antrean})</Text>
                          </View>
                        </TouchableOpacity>
                  </View>
                  </View>
                  )}
              />
                   
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
linearGradient : {
    width : width,
    height : height,
    position : 'absolute',
    zIndex : -1,
    backgroundColor : '#ECECEC'
},
  label : {
    marginLeft : 25 ,
    fontSize : 16,
    fontWeight : 'bold',
    color : 'white'
  },
  email : {
    color : 'white', 
    width : "100%",
    fontSize : 18, 
    paddingLeft : 8, 
    height : 50, 
    textAlignVertical : 'center',
    marginBottom : 10,
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
