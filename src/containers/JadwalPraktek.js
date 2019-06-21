import React, {Component} from 'react';
import {
    StyleSheet, 
    View, 
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
import { StackActions, NavigationActions } from 'react-navigation';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

export default class JadwalPraktek extends Component {
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
            keyword : null,
            hari : 1
        }
        this.hari = ["","SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"]
      }

      componentDidMount(){
        MainStore.getTiket();
        setTimeout(() => {
            this.getJadwalPraktekDokter();
        }, 0);
      }



    getJadwalPraktekDokter=()=>{
        this.setState({loading : true});
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Tamu&idunit="+MainStore.IDUnit)
        .then((res)=>res.json())
        .then((response)=>{
          this.setState({loading : false});
          if(response.status == 'success'){
              this.setState({
                dokter : response.result,
                dokterTmp : response.result
              },()=>{
                var d = new Date();
                var n = d.getDay();
                var kodeHari = ["7","1","2","3","4","5","6"];
                this.setState({
                  hari : kodeHari[n]
                });
                this.filterhari(kodeHari[n]);
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
      if(jk == "l"){
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

    parseJam=(jam)=>{
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
          return el.nama.indexOf(key.toUpperCase()) > -1
      });
      this.setState({
          dokterTmp : newArray
      })
    }

    filterhari=(kode)=>{
      this.setState({
        hari : kode
      },()=>{
        var newArray = this.state.dokter.filter(function (el) {
          return el.hari == kode
        });
        this.setState({
            dokterTmp : newArray
        })
      });
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
                            ):(<Title>Jadwal Praktek</Title>)
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
                  <View style={{width : width, backgroundColor : 'white'}}>
                      <View style={styles.picker}>
                        <Picker
                            mode = {'dropdown'}
                            selectedValue={this.state.hari}
                            onValueChange={(itemValue) => this.filterhari(itemValue)}
                            style={{borderWidth : 1, borderColor : 'white'}}
                            >
                            <Picker.Item  value="1" label="SENIN" />
                            <Picker.Item  value="2" label="SELASA" />
                            <Picker.Item  value="3" label="RABU" />
                            <Picker.Item  value="4" label="KAMIS" />
                            <Picker.Item  value="5" label="JUMAT" />
                            <Picker.Item  value="6" label="SABTU" />
                            <Picker.Item  value="7" label="MINGGU" />
                        </Picker>
                    </View>
                  </View>
                
               
                <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                keyExtractor={item=>item.id}
                data = {this.state.dokterTmp}
                renderItem={({ item, index}) => (
                  <View style={{backgroundColor : 'white',marginBottom : 10}}>
                      <View style={{padding : 10, alignItems : 'center', flexDirection : 'row', width : width, backgroundColor : 'rgba(0,158,20,0.2)'}}>
                        {this.renderPhotoProfile(item.jk)}
                        <View style={{width : width-70}}>
                          <Text style={{fontSize : 16,marginLeft : 5,  fontWeight : 'bold', color : MainStore.primaryCOlor}}>{item.nama}</Text>
                          <Text style={{fontSize : 16,marginLeft : 5, fontStyle : 'italic', color : MainStore.primaryCOlor}}>{item.spesialis}</Text>
                        </View>
                      </View>
                      <View style={{paddingLeft : 15, paddingBottom : 10, borderBottomColor : 'rgba(0,0,0,0.2)', borderBottomWidth : 0.8}}>
                      <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Hari</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{this.hari[item.hari]}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Departemen</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{item.dept}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Jam Buka</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{this.parseJam(item.jam_buka)} s/d {this.parseJam(item.jam_tutup)}</Text>
                            </View>
                        </View>
                      </View>
                      {/* <View style={{width : width, height : 50, flexDirection : 'row', paddingLeft : 20, paddingTop : 10, paddingBottom : 10}}>
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
                  </View> */}
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
    marginTop : 10,
    width: width-40, 
    borderWidth : 1,
    borderColor : 'gray',
    color : 'white',
    height : 50, 
    fontSize : 18,
    marginBottom : 10,
    alignSelf : 'center',
  },
  headerBar :{
    height : 60,
    width : width,
    flexDirection : 'row',
    alignItems : 'center',
    paddingLeft : 10
  },
});
