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
import DateTimePicker from 'react-native-modal-datetime-picker';
import { StackActions, NavigationActions } from 'react-navigation';

export default class DaftarPasien extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            pasien : [],
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
            showTanggal : false
        }
        this.pasien = [];
      }

    setDatePicker=(date)=>{
      var tanggal = (date.getDate()<10 ? '0':'') + date.getDate();
      var bulan = ((date.getMonth()+1) < 10 ? '0' : '') + (date.getMonth()+1);
      var tahun = date.getFullYear();
      this.setState({
          tanggal : tahun+"-"+bulan+"-"+tanggal,
          tanggalDisplay : tanggal+"-"+bulan+"-"+tahun,
          showTanggal : false
      });
    }
    hideDatePicker=()=>{
        this.setState({showTanggal : false});
    }

    componentWillMount(){
      var date2 = new Date();
      var tanggal = (date2.getDate()<10 ? '0':'') + date2.getDate();
      var bulan = ((date2.getMonth()+1) < 10 ? '0' : '') + (date2.getMonth()+1);
      var tahun = date2.getFullYear();
      this.setState({
        tanggal : tahun+"-"+bulan+"-"+tanggal,
        tanggalDisplay : tanggal+"-"+bulan+"-"+tahun,
      });
    }

    componentDidMount(){
      setTimeout(()=>{
          this.getProfil();
      },0);
  }

  getProfil=()=>{
    this.setState({loading : true});
    fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-User&language=id&tiket="+MainStore.tiket+"&action=getPasienList&idunit="+MainStore.IDUnit)
    .then((res)=>res.json())
    .then((response)=>{
      this.setState({loading : false});
      if(response.status == 'success'){
        // alert(JSON.stringify(response.result.length));
        for(var i = 0; i< response.result.length; i++){
          this.pasien.push({nama : response.result[i].pas_nama, norm : response.result[i].pas_norm, selected : false});
        }
        this.setState({
            pasien : this.pasien
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

  refreshProfil=()=>{
    this.pasien = [];
    this.setState({loading : true, pasien : []});
    fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-User&language=id&tiket="+MainStore.tiket+"&action=getPasienList&idunit="+MainStore.IDUnit)
    .then((res)=>res.json())
    .then((response)=>{
      this.setState({loading : false});
      if(response.status == 'success'){
        // alert(JSON.stringify(response.result.length));
        for(var i = 0; i< response.result.length; i++){
          this.pasien.push({nama : response.result[i].pas_nama, norm : response.result[i].pas_norm, selected : false});
        }
        this.setState({
            pasien : this.pasien
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

  checkedPasien=(index)=>{
      for(var i = 0; i < this.pasien.length;i++){
        this.pasien[i].selected = false;
      }
      this.pasien[index].selected = !this.pasien[index].selected;
      this.setState({
        pasien : this.pasien,
        pas_norm : this.pasien[index].norm
      });
  }

  daftarkan=()=>{
    this.setState({loading : true});
    fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Pendaftaran-Online&language=id&action=pendaftaranOnline&tiket="+MainStore.tiket+"&idunit="+MainStore.IDUnit,{
         method : 'POST',
         headers :{
         'Accept' : 'application/json',
         'Content-Type' : 'application/json'
         },
         body : JSON.stringify({
            tanggal : this.state.tanggal,
            pas_norm : this.state.pas_norm,
            peg_id : this.props.navigation.state.params.item.peg_id,
            dept_id : this.props.navigation.state.params.item.dept_id
         })
     }).then((response)=>response.json()).then((res)=>{
        // var a = JSON.stringify(res);
        var b = JSON.parse(res);
         if(b.status == 'failed'){
         this.setState({
             loading : false,
             sucTitle : b.status,
             sucBody : b.message,
             sucAlert : true,
             done : false
         });
         }
         else if(b.status == "error"){
          this.setState({
              loading : false,
              sucTitle : b.status,
              sucBody : b.message,
              sucAlert : true,
              done : false
          });
         }
         else if(b.status == "success"){
          this.setState({
              loading : false,
              sucTitle : b.status,
              sucBody : b.message,
              sucAlert : true,
              done : true
          });
         }
         else if(b.status == "denied"){
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

  parsetanggal=(jamService)=>{
    let dateService = jamService.slice(0, 10);
    let dateNew = dateService.split('-');
    var mm = ["","JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"]
    dateService = dateNew[2]+" "+mm[parseInt(dateNew[1])]+" "+dateNew[0];
    return dateService;
  }

  cekHasil=()=>{
    this.setState({
      sucAlert : false
    });
    setTimeout(()=>{
      if(this.state.done){
        // const resetAction = StackActions.reset({
        //   // index: 4,
        //   actions: [
        //     NavigationActions.navigate({ routeName: 'Riwayat'}),
        //   ],
        // });
        this.props.navigation.replace("Riwayat");
      }
    },0);
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
                         <Title>Daftar Pasien</Title>
                    </View>
                    <Right>
                      <Button transparent onPress={()=>this.refreshProfil()}>
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
                        <View style={{flexDirection : 'row', marginTop : 5, paddingRight : 15, width : width-35 }}>
                            <View style={{width : 150}}>
                              <Text style={{fontSize : 16}}>Jam Buka</Text>
                            </View>
                            <Text style={{fontSize : 16}}> : </Text>
                            <View style={{width : width-150-15-15-15}}>
                              <Text style={{fontSize : 16}}>{this.parseJam(this.props.navigation.state.params.item.djp_jam_buka, this.props.navigation.state.params.item.pr_label_waktu)} s/d {this.parseJam(this.props.navigation.state.params.item.djp_jam_tutup, this.props.navigation.state.params.item.pr_label_waktu)}</Text>
                            </View>
                        </View>
                      </View>
                  </View>

                  <View style={{width : width-30, alignSelf : 'center', marginTop : 10}}>
                    <Text style={{ fontSize:16, marginBottom : 5}}>Tanggal Daftar</Text>
                      <TouchableOpacity style={{flexDirection : 'row',borderColor : 'gray', borderWidth : 1, width : "100%", height : 40, justifyContent : 'center', alignItems : 'center'}} onPress={()=>this.setState({showTanggal : true})} activeOpacity={0.6}>
                            <Icon style={{color: MainStore.primaryCOlor, fontSize:25, marginRight : 8}} name='calendar' />
                            <Text style={{fontSize : 16, color : 'black'}}>{this.state.tanggalDisplay}</Text>
                      </TouchableOpacity>
                      <DateTimePicker
                          isVisible={this.state.showTanggal}
                          onConfirm={(date)=>this.setDatePicker(date)}
                          onCancel={()=>this.hideDatePicker()}
                          mode="date"
                      />
                </View>
                <Text style={{marginTop : 10, marginLeft : 15, fontSize : 16}}>Pasien</Text>
                <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                keyExtractor={item=>item.norm}
                extraData={this.state}
                data = {this.state.pasien}
                renderItem={({ item, index}) => (
                  <View style={{backgroundColor : 'white',marginBottom : 10}}>
                      <ListItem>
                        <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                          <Radio  color={MainStore.primaryCOlor} selectedColor={MainStore.primaryCOlor} selected={item.selected} onPress={()=>this.checkedPasien(index)}/>
                          <TouchableOpacity onPress={()=>this.checkedPasien(index)} style={{flex : 1}}>
                            <Text style={{marginLeft : 4}}>{item.nama} ({item.norm})</Text>
                          </TouchableOpacity>
                        </View>
                      </ListItem>
                  </View>
                  )}
              />

              <Button onPress={()=>this.daftarkan()} iconLeft block style={{marginBottom : 10,width : width-30, alignSelf : 'center', backgroundColor : MainStore.primaryCOlor}}>
                  <Icon style={{fontSize : 20,color : 'white'}} name="brush"/>
                  <Text style={{color : 'white', fontSize : 16, fontWeight : 'bold', marginLeft : 4}}>Daftar Sekarang</Text>
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
});
