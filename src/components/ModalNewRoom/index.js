import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function ModalNewRoom({ setVisible, setUpdateScreen }){

    const [roomName, setRoomName] = useState();

    //pegando dados do usuario logado
    const user = auth().currentUser.toJSON();

    function hendleButtonCreate(){
        if(roomName === '') return;

        //deixar apenas cada usuario criar 6 grupos
        firestore().collection('MESSAGE_THREADS')
        .get()
        .then((snapshot ) => {
            let myThreads = 0;

            snapshot.docs.map( docItem => {
                if(docItem.data().owner === user.uid){
                    myThreads += 1;
                }
            })

            if(myThreads >= 6){
                alert('Você já atingiu o limite de grupos por usuario.');
            }else{
                createRoom();
            }
        })

       

    }

    // criar nova sala no firestore (banco do firebase)
    function createRoom(){
        firestore()
        .collection('MESSAGE_THREADS')
        .add({
            name: roomName,
            owner: user.uid,
            lastMessage: {
                text: `Grupo ${roomName} criado. Bem vindo(a)! `,
                createdAt: firestore.FieldValue.serverTimestamp(),
            }
        })
        .then((docRef)=>{
            docRef.collection('MESSEGES').add({
                text: `Grupo ${roomName} criado. Bem vindo(a)! `,
                createdAt: firestore.FieldValue.serverTimestamp(),
                system: true,
            })
            .then(()=>{
                setVisible();
                setUpdateScreen();
            })

            
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return(
        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={setVisible} >
              <View style={styles.modal} ></View>
            </TouchableWithoutFeedback>

            <View  style={styles.modalContent} >
                <Text style={styles.title} >Criar um novo grupo?</Text>
                <TextInput 
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder="Nome para sua sala?"
                    style={styles.input}
                />

                <TouchableOpacity style={styles.buttonCreate} onPress={hendleButtonCreate} >
                    <Text style={styles.buttonText} >Criar sala</Text>
                </TouchableOpacity>

                <TouchableOpacity  activeOpacity={0.9} style={styles.backBotton} onPress={setVisible} >
                    <Text style={styles.backBottonText} >X</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ModalNewRoom;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba( 34, 34, 34, 0.4)'
    },

    modal:{
        flex: 1,
    },

    modalContent:{
        flex:1,
        backgroundColor: '#FFF',
        padding: 15,
    },

    title:{
        marginTop: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        color: '#000'

    },

    input:{
        borderRadius: 4,
        height: 45,
        backgroundColor: '#DDD',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5,
    },

    buttonCreate:{
        borderRadius: 4,
        backgroundColor: '#2E54D4',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText:{
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF'
    },
    backBotton:{
        backgroundColor: '#F64B57',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '103%',
        right: '6%',
    },
    backBottonText:{
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
    }
})

