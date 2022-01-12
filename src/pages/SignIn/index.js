import React, { useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  Platform
} from 'react-native';

import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SignIn(){
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [type, setType] = useState(false)//false = tela de login / true = tela de cadastro

  //função para cadastrar e logar
  function handleLogin(){
    if(type){
      //cadastrar usuario se o type estiver true
      //se os campos estao vazios nao fazer nada
      if(name === "" || email === "" || password === "") return;

      //cadastrando user
      auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user.updateProfile({
          displayName: name
        })
        .then(()=>{
          //se ele cadastrou e atualizou o displayName cai aqui
          navigation.goBack();
        })
      })
      .catch((error) => {
        //Verifica se o email ja esta em uso.
        if (error.code === 'auth/email-already-in-use') {
          alert('Esse endereço de email já esta em uso!');
        }
        //verifica se o email é invalido
        if (error.code === 'auth/invalid-email') {
          alert('Esse endereço de email é inválido!');
        }
      })

    }else{
      //se o type estiver false o usuario quer logar
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(()=>{
        //se ele fez o login vai voltar para a pagina inicial
        navigation.goBack();
      })
      .catch((error)=>{
         //verifica se o email é invalido
         if (error.code === 'auth/invalid-email') {
          alert('Esse endereço de email é inválido!');
        }
      })
    }
  }

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>HeyGrupos</Text>
      <Text style={{ marginBottom: 20, color: '#121212'}}>Ajude, colabore, faça networking!</Text>

      { type &&(
        <TextInput 
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder='Digite seu nome'
        placeholderTextColor="#99999B"
      />
      )}
      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder='Digite seu email'
        placeholderTextColor="#99999B"
      />
      <TextInput 
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder='******'
        placeholderTextColor="#99999B"
        secureTextEntry={true
        }
      />

      <TouchableOpacity 
        style={[styles.buttomLogin, { backgroundColor: type ? "#51C880" : "#2E54D4"}]}
        onPress={handleLogin}
      >
        <Text style={styles.buttomText}>
          {/** Quando estiver false ele mostrar o nome acessar */}
          {type ? "Cadastrar" : "Acessar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ () => setType(!type) } >
        <Text >
        {type ? "Já possuo uma conta" : "Criar uma nova conta"}
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  logo: {
    marginTop: Platform.OS === 'android' ? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#121212',
  },
  input: {
    color: '#121212',
    backgroundColor: '#EBEBEB',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttomLogin: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 6
  },
  buttomText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19,
  }
})