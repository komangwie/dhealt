import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer,  createSwitchNavigator } from 'react-navigation';
import Login from './src/containers/Login';
import Register from './src/containers/Register';
import Profil from './src/containers/Profil';
import HomePage from './src/containers/HomePage';
import PraktekDokter from './src/containers/PraktekDokter';
import RiwayatKunjungan from './src/containers/RiwayatKunjungan';
import SwitchPage from './src/containers/SwitchPage';
import DaftarPasien from './src/containers/DaftarPasien';
import DaftarRM from './src/containers/DaftarRM';
import AntreanPasien from './src/containers/AntreanPasien';
import JadwalPraktek from './src/containers/JadwalPraktek';
import PraktekDokterUnLogin from './src/containers/PraktekDokterUnLogin';
// console.disableYellowBox = true;

const App = createStackNavigator (
  {
    Home : HomePage,
    Profil : Profil,
    Praktek : PraktekDokter,
    Riwayat : RiwayatKunjungan,
    Daftar : DaftarPasien,
    DaftarRM : DaftarRM,
    Antrean : AntreanPasien,
    Jadwal : JadwalPraktek,
    Login : Login,
    Register : Register,
    PraktekUnLogin : PraktekDokterUnLogin
  }
);

const Auth = createStackNavigator(
  {
    Login : Login,
    Register : Register
  }
);

export default createAppContainer(createSwitchNavigator({
    App : App,
    Auth : Auth
}));
