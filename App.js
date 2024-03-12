import { StatusBar } from 'react-native'
import { Button, Text ,SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { collection,addDoc,serverTimestamp,MESSAGES,firestore } from './firebase/config';
import { useEffect, useState } from 'react';
import { QuerySnapshot, onSnapshot,query } from 'firebase/firestore';
import { converFirebaseTimeStampToJs } from './helpers/Functions';

export default function App() {
  const [messages, setMessages] = useState([])
  //const [newMessage, setNewMessage] = useState('')

  useEffect(()  => {
    const q = query(collection(firestore, MESSAGES))

    const unsubscribe = onSnapshot(q,(querySnapshot) => {
      const tempMessages = []

      querySnapshot.forEach((doc) => {
        const messageObject = {
          id: doc.id,
          text: doc.data().text,
          created: converFirebaseTimeStampToJs(doc.data().created)
        }
        tempMessages.push(messageObject)
      })
      setMessages(tempMessages)
    })

    return() => {
      unsubscribe()
    }
  }, [])

return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {
          messages.map((message) => (
            <View style={styles.message} key={message.id}>
              <Text style={styles.messageInfo}>{message.created}</Text>
              <Text>{message.text}</Text>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding:10,
    marginTop:10,
    marginBottom:10,
    backgroundColor:'#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  },
  messageInfo: {
    fontSize: 12
  },
});