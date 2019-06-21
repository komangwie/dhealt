import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, View, 
    Dimensions,
    FlatList,
    ToastAndroid,
    TouchableOpacity,
    Alert
} from 'react-native';
import {Container, Content,Icon, Button ,Thumbnail, Header, Left, Right, Title, Card, Fab} from 'native-base';
var{width,height} = Dimensions.get('window');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';
import {observer} from 'mobx-react';

@observer
export default class Profil extends Component {
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
            modal_status : false,
            done : false
        }
      }

      componentDidMount(){
          setTimeout(()=>{
              this.getProfil();
          });
      }

      getProfil=()=>{
        this.setState({loading : true});
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-User&language=id&tiket="+MainStore.tiket+"&action=getPasienList&idunit="+MainStore.IDUnit)
        .then((res)=>res.json())
        .then((response)=>{
          // alert(JSON.stringify(response));
          this.setState({loading : false});
          if(response.status == 'success'){
            MainStore.setPasien(response.result);
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

      parsetanggal=(jamService)=>{
        let dateService = jamService.slice(0, 10);
        let dateNew = dateService.split('-');
        var mm = ["","JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"]
        dateService = dateNew[2]+" "+mm[parseInt(dateNew[1])]+" "+dateNew[0];
        return dateService;
      }

      parseNoRm=(norm)=>{
        var norm = norm.trim();
        var pjg0 = 6;
        var len = norm.length;

        pjg0 =  pjg0 - len;

        var nomor0 = "";
        for(var i=1;i<=pjg0;i++) {
          nomor0 = nomor0 + "0";
        }
        norm = nomor0+""+norm;

        len = norm.length;
        var newnorm = "";
        for(var i=0;i<len;i++){
          if(len % 2==0){
            if(i % 2==1){
              newnorm = newnorm+""+norm.charAt(i)+"-";
            }else{
              newnorm = newnorm+""+norm.charAt(i);
            }
          }else{
            if(i % 2==0){
              newnorm = newnorm+""+norm.charAt(i)+"-";
            }else{
              newnorm = newnorm+""+norm.charAt(i);
            }
          }
        }

        newnorm = newnorm.substr(0,norm.length+2);
        return newnorm;
      }
    
    konfirmHapus=(norm, nama)=>{
      Alert.alert(
        'Hapus',
        'Apakah Anda yakin untuk menghapus perserta ('+norm+') '+nama+'??',
        [
          {
            text: 'Tidak',
            onPress: () =>null,
            style: 'cancel',
          },
          {text: 'Ya', onPress: () => {
           this.hapusPeserta(norm);
          }
        },
        ],
        {cancelable: false},
      );
    }

    hapusPeserta=(norm)=>{
      this.setState({loading : true});
      fetch(MainStore.domain+"/?pagetype=service&page=Web-Service-Tambahkan-Peserta&language=id&tiket="+MainStore.tiket+"&idunit="+MainStore.IDUnit+"&action=registerPesertaHapus&pas_norm="+norm)
      .then((res)=>res.json())
      .then((response)=>{
        this.setState({loading : false});
        // alert(JSON.stringify(response));
        if(response.status == 'success'){
          this.setState({
            sucTitle : response.title,
            sucBody : response.message,
            done : true,
            sucAlert : true
          });

        }
        else if(response.status == 'error'){
          this.setState({
            sucTitle : response.title,
            sucBody : response.message,
            done : false,
            sucAlert : true
          });
        }
        else if(response.status == 'failed'){
          this.setState({
            sucTitle : response.title,
            done : false,
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

    stateModal=()=>{
      this.setState({
        sucAlert : false
      },()=>{
        if(this.state.done){
          this.setState({
            done : false
          },()=>{
            this.getProfil();
          });
        }
      });
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
                    <View style={{height : '100%', justifyContent : 'center'}}>
                         <Title>Pasien Terdaftar</Title>
                    </View>
                    <Right>
                      <Button transparent onPress={()=>this.getProfil()}>
                          <Icon name='refresh' />
                      </Button>
                    </Right>
                </Header>
                <Content >
                
                    <FlatList
                        data={MainStore.pasien}
                        renderItem={({ item, index }) => {
                        return (
                                <Card style={{width : width-20, alignSelf : 'center', padding : 10}}>
                                {item.pas_jk == 'P' ? (
                                    <Thumbnail style={{alignSelf : 'center'}} large source={require("./../../assets/images/female.png")}/>

                                ) : (
                                    <Thumbnail style={{alignSelf : 'center'}} large source={require("./../../assets/images/male.png")}/>
                                )}
                                   
                                    <View style={{flexDirection : 'row', paddingTop : 20, borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5, paddingBottom : 10}}>
                                        <View style={{ width : wp('40%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>No Rekam Medis</Text>
                                        </View>
                                        <View style={{width : wp('2%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>:</Text>
                                        </View>
                                        <View style={{flex : 1, alignSelf : 'stretch'}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>{item.pas_norm ? this.parseNoRm(item.pas_norm) : null}</Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection : 'row', paddingTop : 10, borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5, paddingBottom : 10}}>
                                        <View style={{ width : wp('40%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>Nama Pasien</Text>
                                        </View>
                                        <View style={{width : wp('2%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>:</Text>
                                        </View>
                                        <View style={{flex : 1, alignSelf : 'stretch'}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>{item.pas_nama}</Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection : 'row', paddingTop : 10, borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5, paddingBottom : 10}}>
                                        <View style={{ width : wp('40%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>Jenis Kelamin</Text>
                                        </View>
                                        <View style={{width : wp('2%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>:</Text>
                                        </View>
                                        <View style={{flex : 1, alignSelf : 'stretch'}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>{item.pas_jk == 'P' ? 'PEREMPUAN' : 'LAKI-LAKI'}</Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection : 'row', paddingTop : 10, borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5, paddingBottom : 10}}>
                                        <View style={{ width : wp('40%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>Tanggal Lahir</Text>
                                        </View>
                                        <View style={{width : wp('2%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>:</Text>
                                        </View>
                                        <View style={{flex : 1, alignSelf : 'stretch'}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>{item.pas_tanggal_lahir ? this.parsetanggal(item.pas_tanggal_lahir) : null}</Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection : 'row', paddingTop : 10, borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5, paddingBottom : 10}}>
                                        <View style={{ width : wp('40%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>No Handphone</Text>
                                        </View>
                                        <View style={{width : wp('2%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>:</Text>
                                        </View>
                                        <View style={{flex : 1, alignSelf : 'stretch'}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>{item.pas_nohp ? item.pas_nohp : '-'}</Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection : 'row', paddingTop : 10, borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5, paddingBottom : 10}}>
                                        <View style={{ width : wp('40%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>Alamat</Text>
                                        </View>
                                        <View style={{width : wp('2%')}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>:</Text>
                                        </View>
                                        <View style={{flex : 1, alignSelf : 'stretch'}}>
                                        <Text style={{fontSize : 14, fontWeight : 'bold'}}>{item.pas_alamat}</Text>
                                        </View>
                                    </View>
                                <TouchableOpacity onPress={()=>this.konfirmHapus(item.pas_norm, item.pas_nama)} style={{flexDirection : 'row', alignItems : 'center', marginTop : 20}}>
                                  <Icon name="trash" style={{fontSize : 20, color : 'red'}}/>  
                                  <Text style={{color : 'red', marginLeft : 4}}>Hapus</Text>                              
                                </TouchableOpacity>
                                </Card>
                        );
                        }}
                        keyExtractor={item =>item.pas_norm.toString()}
                    />
                </Content>
                <Fab
                      style={{ backgroundColor: MainStore.primaryCOlor }}
                      onPress={() => this.props.navigation.navigate("DaftarRM")}
                      >
                      <Icon name="add" />
                    </Fab>
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
                    close = {()=>this.stateModal()}
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
    fontSize : 14,
    fontWeight : 'bold',
    color : 'white'
  },
  headerBar :{
    height : 60,
    width : width,
    flexDirection : 'row',
    alignItems : 'center',
    paddingLeft : 10
  },
});
