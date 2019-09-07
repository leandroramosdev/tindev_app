import React, { Component, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';


import logo from '../assets/images/logo.png';
import api from '../services/api'

export default function Login ({ navigation }){
  const [user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if(user){
        navigation.navigate('Main', {user})
      }
    })
  }, []);

  async function handleLogin(){
    const response = await api.post('/dev/insert', { username: user });

    const { _id } = response.data;
    console.log(_id);

    await AsyncStorage.setItem('user', _id);

    navigation.navigate('Main', { user: _id });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS == 'ios'}
      style={styles.container}
      >
      <Image source={logo} style={styles.logo}/>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário do github"
        style={styles.input}
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 30
  },
  logo: {
    paddingTop: -10
  },
  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
    textAlign: 'left'
  },
  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#DF4723',
    marginTop: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',

  }
});
