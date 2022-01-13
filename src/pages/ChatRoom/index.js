import React, {useState, useEffect} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal,
  ActivityIndicator
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//nevagar para outra tela
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';

export default function ChatRoom(){
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);


  //vericando quando abrir o app se o usuario esta logado ou não
  useEffect(()=>{

    // se o currentUser devolver null não a nunhum usuario logado
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    console.log(hasUser);

    setUser(hasUser);

  }, [isFocused]);

  //responsavel por buscar os chats
  useEffect(()=>{
    let isActive = true;

    function getChats(){
      firestore()
      .collection('MESSAGE_THREADS')
      .orderBy('lastMessage.createdAt', 'desc')
      .limit(10)
      .get()
      .then((snapshot)=>{
        const threads = snapshot.docs.map( documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            lastMessage: { text : ''},
            ...documentSnapshot.data()
          }
        })

        //so ira fazer alteracao se o isActive estiver true
        if(isActive){
          setThreads(threads);
          setLoading(false);
          console.log(threads);
        }
        

      })
    }

    getChats();

    return () => {
      isActive = false;
    }


  },[isFocused]);

  function handleSignOut(){
    auth() 
    .signOut()
    .then(()=>{
      setUser(null)
      //se ele deslogou vamos navegar ele para essa tela
      navigation.navigate("SignIn")
    })
    .catch(()=>{ 
      //se cair aqui não esta logado ou não poassui usuario
      console.log("Nao possui nenhum usuario")
    })
  }

  //exibindo loading se estiver true
  if(loading){
    return(
      <ActivityIndicator size="large" color="#555" />
    );
  }


  return(
    <SafeAreaView style={styles.container}>
      {/** Inicio Header */}
      <View style={styles.headerRoom}>

        <View style={styles.headerRoomLeft} >

         { user && (
            <TouchableOpacity onPress={handleSignOut} >
             <MaterialIcons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
         )}

          <Text style={styles.title} >Grupos</Text>
        </View>

        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/** Fim Header */}

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

      <Modal visible={modalVisible} animationType='fade'  transparent={true} >
        <ModalNewRoom setVisible={() => setModalVisible(false)}  />
      </Modal>

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