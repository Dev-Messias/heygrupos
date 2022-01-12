import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';

import auth from '@react-native-firebase/auth';
//nevagar para outra tela
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ChatRoom(){
  const navigation = useNavigation();

  function handleSignOut(){
    auth() 
    .signOut()
    .then(()=>{
      //se ele deslogou vamos navegar ele para essa tela
      navigation.navigate("SignIn")
    })
    .catch(()=>{ 
      //se cair aqui não esta logado ou não poassui usuario
      console.log("Nao possui nenhum usuario")
    })
  }


  return(
    <SafeAreaView style={styles.container}>
      {/** Inicio Header */}
      <View style={styles.headerRoom}>

        <View style={styles.headerRoomLeft} >
          <TouchableOpacity onPress={handleSignOut} >
              <MaterialIcons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title} >Grupos</Text>
        </View>

        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/** Fim Header */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  }, 
  headerRoom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2E54D4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  title:{
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    paddingLeft: 20,
  }

})