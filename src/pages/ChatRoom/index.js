import React, {useState, useEffect} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//nevagar para outra tela
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';
import ChatList from '../../components/ChatList';

//animação loading
import LottieView from 'lottie-react-native';

export default function ChatRoom(){
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);


  //vericando quando abrir o app se o usuario esta logado ou não
  useEffect(()=>{

    // se o currentUser devolver null não a nunhum usuario logado
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    //console.log(hasUser);

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
          //console.log(threads); 
        }
        

      })
    }
   
    getChats();
    

    return () => {
      isActive = false;
    }


  },[isFocused, updateScreen]);

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent:'center', backgroundColor:'#FFFFFF'}} >
        <LottieView 
        source={require('../../assets/loadingM.json')}
        autoPlay={true}
        loop={true}
        />
      </View>
    );
  }

//deleteando item da lista
function deleteRoom(ownerId, idRoom){
  //verificando se o id do usuario que esta logado é diferente do dono da sala
  //ira para o codigo
  if(ownerId !== user?.uid)return;

  //se o usuario for o dono
  Alert.alert(
    "Atenção",
    "Você tem certeza que deseja deletar esse grupo?",
    [
     {
      text: "Cancel",
      onPress: () => {},
      style: 'cancel'
     },
     {
       text: "OK",
       onPress: () => handleDeleteRoom(idRoom)
     }
    ]
  )
}

 //função para deletar no banco
 async function handleDeleteRoom(idRoom){
  await firestore()
        .collection('MESSAGE_THREADS')
        .doc(idRoom)
        .delete();

        setUpdateScreen(!updateScreen);
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

        <TouchableOpacity onPress={() => navigation.navigate('Search')} >
          <MaterialIcons name="search" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/** Fim Header */}

      <FlatList 
        data={threads}
        keyExtractor={ item => item._id }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatList data={item} deleteRoom={() => deleteRoom( item.owner, item._id)} userStatus={user} />
        )}
      />

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

      <Modal 
      visible={modalVisible} animationType='fade'  transparent={true} >
        <ModalNewRoom 
          setVisible={() => setModalVisible(false)}  
          setUpdateScreen={ () => setUpdateScreen(!updateScreen)}
        />
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#FFF',
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