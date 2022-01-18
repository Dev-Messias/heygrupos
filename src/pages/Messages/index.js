import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Messages({ route }){

  const { thread } = route.params;
  const [ messages, setMessages ] = useState([]);

  const user = auth().currentUser.toJSON();

  useEffect(()=>{

    const unsubscribeListiner = firestore().collection('MESSAGE_THREADS')
    .doc(thread._id)
    .collection('MESSEGES')
    .orderBy('createdAt', 'desc')
    .onSnapshot( querySnapshot => {
      const messages = querySnapshot.docs.map(doc =>{
        const firebaseData = doc.data()

        const data ={
          _id: doc.id,
          text: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...firebaseData
        }

        //se não tiver system vamos juntar os dados do user
        if(!firebaseData.system){
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.displayName
          }
        }

        return data;

      })

      setMessages(messages);
    })

    return () => unsubscribeListiner()
    

  }, []);

  return(
    <View style={styles.container}>
      <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})