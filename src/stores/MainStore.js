import {observable, action, computed} from 'mobx';
import {
  AsyncStorage
} from 'react-native';

class MainStore {
  @observable domain = 'https://dhealth.id';
  @observable IDUnit = "FK201900001";
  @observable primaryCOlor = '#069E15';
  @observable statusbarColor = "#058e12";
  @observable pasien = [];
  @observable tiket = null;
  @observable profilMahasiswa = [{id:null,nama:null,tanggallahir:null,tempatlahir:null,alamat:null,nik:null,email:null,jeniskelamin:null,telp:null,hp:null,photo:""}];
  
  @action setTiket(tiket){
    this.tiket = tiket;
  }

  @action async getTiket(){
    this.tiket = await AsyncStorage.getItem('tiket');
  }

  @action async logOut(){
    this.tiket = null;
    this.profilMahasiswa = [{id:null,nama:null,tanggallahir:null,tempatlahir:null,alamat:null,nik:null,email:null,jeniskelamin:null,telp:null,hp:null,photo:""}];
    let keys = ['tiket', 'email'];
    let a = await AsyncStorage.multiRemove(keys, (err) => {

    });
  }

  @action setPasien(obj){
    this.pasien = obj;
  }

}
export default new MainStore();