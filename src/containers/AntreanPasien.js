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
    ToastAndroid,
    TextInput
} from 'react-native';
import {Container, Label, Content,Icon, Button ,Thumbnail, Picker, Header, Left, Body,Radio, Right, Title, Card, Item, ListItem, CheckBox} from 'native-base';
var{width,height} = Dimensions.get('window');
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';
import {FlatGrid } from 'react-native-super-grid';

class MyListItem extends React.PureComponent {
  select_backgroundColor=(status)=>{
    var color = null;
    if(status == "BELUM_DATANG"){
        color = "blue"; //blue
    }
    else if (status == "SUDAH_DATANG"){
        color = "green"; //yellow #f4d941
    }
    else if(status == "SUDAH_DIPERIKSA"){
        color = '#FFC107';
    }
    else if(status == "TIDAK_DATANG"){
      color = 'gray';
    }
  
    return color;
  }
    
  render() {
    return (
      <Card style={[{ backgroundColor : this.select_backgroundColor(this.props.item.pasien_datang)}, styles.listWrapper]}>
         <Text style={styles.lisContent}>{this.props.item.noantrian}</Text>
      </Card>
    )
  }
}

export default class AntreanPasien extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            antrean : [],
            loading : false,
            sucAlert : false,
            sucTitle : '',
            sucBody : '',
            modal_status : false,
            search : false,
            keyword : null,
            tanggal : '',
            tanggalDisplay : '',
            pas_norm : null,
            showTanggal : false,
            belumDatang : 0,
            sudahDatang : 0,
            sudahDiperiksa : 0,
            tidakDatang : 0,
            lain : 0
        }
      }

      _renderItem = ({item}) => (
        <MyListItem
             item = {item}
        />
      );
    

      componentDidMount(){
        this.getAntrean();
      }
      
      getAntrean=()=>{
        this.setState({loading : true});
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Antrean-Pasien&language=id&idunit="+MainStore.IDUnit+"&id_pegawai="+this.props.navigation.state.params.item.peg_id+"&dept_id="+this.props.navigation.state.params.item.dept_id)
        .then((res)=>res.json())
        .then((response)=>{
          this.setState({loading : false});
          if(response.status == 'success'){
              this.setState({
                antrean : response.result
              });
              var blmdtg = 0;
              var sdhdtg = 0;
              var sdhprksa = 0;
              var tdkdtg = 0;
              var lain = 0;
              for(var i = 0; i<response.result.length; i++){
                  if(response.result[i].pasien_datang == "BELUM_DATANG"){
                    blmdtg = blmdtg + 1;
                  }
                  else if(response.result[i].pasien_datang == "SUDAH_DATANG"){
                    sdhdtg = sdhdtg + 1;
                  }
                  else if(response.result[i].pasien_datang == "SUDAH_DIPERIKSA"){
                    sdhprksa = sdhprksa + 1;
                  }
                  else if(response.result[i].pasien_datang == "TIDAK_DATANG"){
                    tdkdtg = tdkdtg + 1;
                  }
                  else{
                    lain = lain + 1;
                  }
              }

              this.setState({
                belumDatang : blmdtg,
                sudahDatang : sdhdtg,
                sudahDiperiksa : sdhprksa,
                tidakDatang : tdkdtg,
                lain : lain
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
    if(jk.toUpperCase() == "L"){
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

  cekHasil=()=>{
    this.setState({
      sucAlert : false
    });
    setTimeout(()=>{
      if(this.state.done){
        this.props.navigation.replace("Riwayat");
      }
    },0);
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
            <Container >
                 <Header androidStatusBarColor={MainStore.statusbarColor} style={{backgroundColor : MainStore.primaryCOlor}}>
                    <Left>
                    <Button transparent onPress={()=>this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                    </Left>
                    <View style={{height : '100%', justifyContent : 'center'}}>
                         <Title>Antrean Pasien</Title>
                    </View>
                    <Right>
                      <Button transparent onPress={()=>this.getAntrean()}>
                          <Icon name='refresh' />
                      </Button>
                    </Right>
                </Header>
                <Content >
                <View style={{backgroundColor : 'white',marginBottom : 10}}>
                      <View style={{padding : 10, alignItems : 'center', flexDirection : 'row', width : width, backgroundColor : 'rgba(0,158,20,0.2)'}}>
                        {this.renderPhotoProfile(this.props.navigation.state.params.item.peg_jk)}
                        <View style={{width : width-70}}>
                          <Text style={{fontSize : 16,marginLeft : 5,  fontWeight : 'bold', color : MainStore.primaryCOlor}}>{this.props.navigation.state.params.item.peg_nama}</Text>
                          <Text style={{fontSize : 16,marginLeft : 5, fontStyle : 'italic', color : MainStore.primaryCOlor}}>{this.props.navigation.state.params.item.drsp_name}</Text>
                        </View>
                      </View>
                      <View style={{paddingLeft : 15, paddingBottom : 10, borderBottomColor : 'rgba(0,0,0,0.2)', borderBottomWidth : 0.8}}>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Departemen</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{this.props.navigation.state.params.item.dept_name}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Hari, Tanggal</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{this.props.navigation.state.params.item.djp_hari}, {this.parsetanggal(this.props.navigation.state.params.item.tanggal)}</Text>
                            </View>
                        </View>
                        {
                          this.props.navigation.state.params.item.djp_jam_buka ?  (
                            <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                                <View style={{width : 150}}>
                                  <Text style={{fontSize : 16}}>Jam Buka</Text>
                                </View>
                                <Text style={{fontSize : 16}}> : </Text>
                                <View style={{width : width-150-15-15-15}}>
                                  <Text style={{fontSize : 16}}>{this.parseJam(this.props.navigation.state.params.item.djp_jam_buka, this.props.navigation.state.params.item.pr_label_waktu)} s/d {this.parseJam(this.props.navigation.state.params.item.djp_jam_tutup, this.props.navigation.state.params.item.pr_label_waktu)}</Text>
                                </View>
                            </View>
                          ) : null
                        }
                       
                      </View>
                  </View>

                  <View style={{flex : 1, flexDirection : 'row', justifyContent : 'center'}}>
                    <Card style={{padding : 15, width : width- 20, backgroundColor : 'red'}}>
                        <Text style={{color : 'white', fontWeight : 'bold', textAlign : 'center'}}>TOTAL : {this.state.antrean.length} PASIEN</Text>
                    </Card>
                  </View>

                  <View style={{flex : 1, flexDirection : 'row',}}>
                    <Card style={{ marginLeft : 40/3,padding : 15, width : width/2 - 20, backgroundColor : "blue"}}>
                        <Text style={{color : 'white', fontWeight : 'bold'}}>Belum Datang : {this.state.belumDatang} Pasien</Text>
                    </Card>
                    <Card style={{ marginLeft : 36/3,padding : 15, width : width/2 - 20, backgroundColor : "green"}}>
                        <Text style={{color : 'white', fontWeight : 'bold'}}>Sudah Datang : {this.state.sudahDatang} Pasien</Text>
                    </Card>
                  </View>

                <View style={{flex : 1, flexDirection : 'row',}}>
                    <Card style={{marginLeft : 40/3,padding : 15, width : width/2 - 20, backgroundColor : '#FFC107'}}>
                        <Text style={{color : 'white', fontWeight : 'bold'}}>Sudah Diperiksa : {this.state.sudahDiperiksa} Pasien</Text>
                    </Card>
                    <Card style={{ marginLeft : 36/3,padding : 15, width : width/2 - 20, backgroundColor : 'gray'}}>
                        <Text style={{color : 'white', fontWeight : 'bold'}}>Tidak Datang : {this.state.tidakDatang} Pasien</Text>
                    </Card>
                </View>
               
                  
                <Text style={{marginTop : 10,textAlign : 'center', fontSize : 16}}>NOMOR ANTREAN PASIEN</Text>
                <FlatGrid
                  
                  itemDimension={width/5}
                  items={this.state.antrean}
                  fixed
                  // spacing={20}
                  // renderItem={({ item, index }) => (
                  //     <Card style={{ backgroundColor : this.select_backgroundColor(item.pasien_datang),width : width/5,borderRadius : 5, padding : 10,alignItems : 'center', justifyContent : 'center'}}>
                  //         <Text style={{fontSize : 20, color : 'white', fontWeight: 'bold'}}>{item.noantrian}</Text>
                  //     </Card>
                  // )}
                  renderItem={(item)=>this._renderItem(item)}
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
                    close = {()=>this.cekHasil()}
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
  listWrapper : {
    width : width/5,borderRadius : 5, padding : 10,alignItems : 'center', justifyContent : 'center'
  },
  lisContent : {
    fontSize : 20, color : 'white', fontWeight: 'bold'
  }
});
