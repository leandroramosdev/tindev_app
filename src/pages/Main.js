import React, { Component, useEffect, useState  } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, SafeAreaView, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import api from '../services/api'

import logo from '../assets/images/logo.png';
import like from '../assets/images/heart.png';
import dislike from '../assets/images/close.png';

export default function Main({ navigation }){
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);

  console.log(id);

  useEffect(() => {
    async function loadUsers(){
      const response = await api.get('/dev/list', {
        headers: {
          user: navigation.getParam('user')
        }
      })
      console.log(response.data);
      setUsers(response.data)
    }

    loadUsers();
  }, [id]);

  async function handleLike(id){
    const [ user, ...rest ] = users;
    var currentUser = navigation.getParam('user');

    await api.post('/dev/like/' + user._id, null, {
      header: { user: currentUser },
    })

    console.log(rest);

    setUsers(rest)
  }

  async function handleDislike(id){
    const [ user, ...rest ] = users;
    var currentUser = navigation.getParam('user');

    await api.post('/dev/dislike/' + user._id, null, {
      header :{ user: currentUser }
    });

    setUsers(rest)
  }

  async function handleLogout(){
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return(
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo}/>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
          { users.length == 0
            ? <Text style={styles.empty}>Acabou : (</Text>
            : (
              users.map((user, index) => (
              <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                </View>
              </View>
            ))
          ) }
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDislike}>
          <Image source={dislike} style={styles.buttonIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Image source={like} style={styles.buttonIcon}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  cardContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  logo: {
    marginTop: 20
  },

  empty : {
    alignSelf: 'center',
    color: "#999",
    fontSize: 24,
    fontWeight: 'bold'
  },

  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  bio:{
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30
  },
  button : {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  buttonIcon: {
    alignSelf: 'center',
    width: 25,
    height: 25
  }
});
