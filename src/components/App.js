import React, { useState, useEffect } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import _uniqueId from 'lodash/uniqueId'

const setTodos = async (todos) => {
  try {
    await AsyncStorage.setItem('@todo:list', JSON.stringify(todos))
  } catch (e) {
    console.error(e)
  }
}
const getTodos = async () => {
  try {
    return JSON.parse(await AsyncStorage.getItem('@todo:list'))
  } catch (e) {
    console.error(e)
  }
}

const ListItem = ({ item }) =>
  <View style={styles.listItem}>
    <Text style={styles.listItemText}>{item}</Text>
  </View>

export default function App() {
  const [ todos, updateTodos ] = useState([])
  const [ todoEdit, setTodoEdit ] = useState('')

  const saveTodo = async () => {
    if (todoEdit.length) {
      const todosNew = [ ...todos, todoEdit ]

      updateTodos(todosNew)
      await setTodos(todosNew)
      setTodoEdit('')
    }
  }

  useEffect(() => {
    getTodos().then(updateTodos)
  }, [ todos.length ])

  return (
    <KeyboardAvoidingView enabled behavior='padding' style={styles.container}>
      <FlatList
        data={todos}
        renderItem={ListItem}
        keyExtractor={_uniqueId}
        style={styles.header}
      />

      <View style={styles.footer}>
        <TextInput
          value={todoEdit}
          onChangeText={setTodoEdit}
          onSubmitEditing={saveTodo}
          returnKeyType='done'
          style={styles.input}
        />
        <Button
          title='SAVE'
          color='black'
          onPress={saveTodo}
          style={styles.saveTodo}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    flex: 0.8,
    width: '100%',
  },
  footer: {
    flex: 0.2,
    width: '100%',
  },
  input: {
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 25,
  },
  saveTodo: {
    width: '100%',
    height: 150,
    alignItems: 'center',
  },
  listItem: {
    width: '100%',
    height: 50,
    backgroundColor: '#ccdfff',
    marginBottom: 5,
  },
  listItemText: {
    fontSize: 25,
    textAlign: 'center',
    lineHeight: 50,
  },
})
