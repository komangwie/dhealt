import React, {Component} from 'react';
import {
    StyleSheet, 
    Text, View, 
    TouchableOpacity,
    StatusBar,
    Dimensions,
    FlatList,
    ToastAndroid
} from 'react-native';
import {Container, Content,Icon, Button ,Thumbnail, Header, Left, Right, Title, Card} from 'native-base';
var{width,height} = Dimensions.get('window');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MainStore from './../stores/MainStore';
import Loading from './../components/Loading';
import AlertModal from './../components/Alert';

export default class RiwayatKunjungan extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state ={
            riwayat : [],
            kosong : false,
            loading : false,
            sucAlert : false,
            sucTitle : '',
            sucBody : '',
            modal_status : false,
        }
      }

      componentDidMount(){
          setTimeout(()=>{
              this.getRiwayat();
          });
      }

      getRiwayat=()=>{
        this.setState({loading : true});
        fetch(MainStore.domain+"/index.php?pagetype=service&page=Web-Service-Kunjungan-Pasien&language=id&action=getKunjunganPasien&tiket="+MainStore.tiket+"&idunit="+MainStore.IDUnit)
        .then((res)=>res.json())
        .then((response)=>{
          this.setState({loading : false});
          if(response.status == 'success'){
            this.setState({
                riwayat : response.result,
              kosong : false
            });
          }
          else if(response.status == 'error'){
            this.setState({
              sucTitle : response.title,
              sucBody : response.message,
              sucAlert : true,
              kosong : true
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
        var newdate = new Date(dateNew[1]+"/"+dateNew[2]+"/"+dateNew[0]);
        var day = newdate.getDay();
        var dd = ["MINGGU","SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
        dateService = dd[day] +", "+ dateNew[2]+" "+mm[parseInt(dateNew[1])]+" "+dateNew[0];

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
            <Container style={{backgroundColor : '#ECECEC'}}>
                <Header androidStatusBarColor={MainStore.statusbarColor} style={{backgroundColor : MainStore.primaryCOlor}}>
                    <Left>
                    <Button transparent onPress={()=>this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                    </Left>
                    <View style={{height : '100%', justifyContent : 'center'}}>
                         <Title>Riwayat Pemeriksaan</Title>
                    </View>
                    <Right>
                      <Button transparent onPress={()=>this.getRiwayat()}>
                          <Icon name='refresh' />
                      </Button>
                    </Right>
                </Header>
                <Content style={{padding : 5}}>
                  {
                    this.state.kosong ? (
                      <Card style={{width : width-20, alignSelf : 'center', padding : 10}}>
                          <Text style={{textAlign : 'center', fontSize : 16, fontWeight : 'bold'}}>Tidak Ada Riwayat Kunjungan</Text>
                      </Card> 
                    ) : null
                  }
                   
                    <FlatList
                        data={this.state.riwayat}
                        renderItem={({ item, index }) => {
                        return (
                          <View style={{width : '100%', flexDirection : 'row', backgroundColor : 'white', marginTop : 5}}>
                            <View style={{ aspectRatio : 1, backgroundColor : this.select_backgroundColor(item.pasien_datang), borderBottomColor : 'white', borderBottomWidth : 0.5, padding : 5, alignItems : 'center', justifyContent : 'center'}}>
                                <Text style={{color : 'white', fontSize : 40, fontWeight : 'bold'}}>{item.noantrain}</Text>
                                <Text style={{color : 'white', fontSize : 16, textAlign : 'center'}}>{item.dept_name}</Text>
                            </View>
                            <View style={{ alignSelf : 'stretch', flex : 1, padding : 5, justifyContent : 'center', borderBottomWidth : 0.5, borderBottomColor : '#E8E8E8', borderTopWidth : index == 0? 0.5 : 0, borderTopColor : index == 0? '#E8E8E8':'white'}}>

                                <View style={{flexDirection : 'row', borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5}}>
                                    <View style={{flex : 1, alignSelf : 'stretch',  }}>
                                      <Text numberOfLines={2} style={{fontWeight : 'bold'}} > { item.tanggal ? this.parsetanggal(item.tanggal) : null}</Text>
                                    </View>
                               </View>

                                <View style={{flexDirection : 'row', borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5}}>
                                    <View style={{flex : 1, alignSelf : 'stretch',  }}>
                                      <Text numberOfLines={1}  style={{fontWeight : 'bold'}}> {item.peg_nama}</Text>
                                    </View>
                                 </View>
                           
                               

                               <View style={{flexDirection : 'row', borderBottomColor : 'rgba(0,0,0,0.3)', borderBottomWidth : 0.5}}>
                                    <View style={{flex : 1, alignSelf : 'stretch',  }}>
                                      <Text numberOfLines={1}  > {item.pas_nama}</Text>
                                    </View>
                               </View>

                               
                               <View style={{flexDirection : 'row'}}>
                                    <View style={{flex : 1, alignSelf : 'stretch'}}>
                                      <Text numberOfLines={2}  style={{fontStyle : 'italic'}}> {item.pasien_datang.replace('_', " ")}</Text>
                                    </View>
                               </View>

                               <View style={{flexDirection : 'row'}}>
                               <View style={{flex : 1, alignSelf : 'stretch',  }}>
                                      <Text numberOfLines={2}  ></Text>
                                    </View>
                               </View>

                            </View>
                          </View>
                        );
                        }}
                        keyExtractor={(item, index) => index}
                    />
                    <View style={{marginTop : 10}}></View>
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
rows : {
  width : 120, 
   
},
  label : {
    marginLeft : 25 ,
    fontSize : 16,
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
