import {
    View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { PlusIcon } from 'react-native-heroicons/outline'
import { StatusBar } from 'expo-status-bar';


const { height, width } = Dimensions.get('window');

export default function HomeScreen() {
    const intialState = {
        id: 0,
        title: '',
        description: '',
        completed: false,
    };

    const [todo, setTodo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTodo, setNewTodo] = useState(intialState);
    

    const getTodos = async () => {
        const todos = await AsyncStorage.getItem('todo');
        setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
    };

    useEffect(() => {
        getTodos();
    }, []);

    const handleChange = (title, value) =>
        setNewTodo({ ...newTodo, [title]: value });

    const clear = () => setNewTodo(intialState);

    const addTodo = () => {
        if (!newTodo.title || !newTodo.description) {
            alert('Please enter all the values.');
            return;
        }

        newTodo.id = todo.length + 56;
        const updatedTodo = [newTodo, ...todo];
        setTodo(updatedTodo);
        AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
        clear();
        setShowModal(false);
    };

    const deleteTodo = async (id) => {
        const updatedTodo = todo.filter((item) => item.id !== id);
        setTodo(updatedTodo);
        await AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
    };


    const updateTodo = (updatedItem) => {
        const updatedTodoList = todo.map(item => {
            if (item.id === updatedItem.id) {
                return { ...item, completed: !item.completed };
            }
            return item;

        });

        setTodo(updatedTodoList);
        AsyncStorage.setItem('todo', JSON.stringify(updatedTodoList));
    };

    const handleLongPress = (item) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => deleteTodo(item.id)
                }
            ]
        );
    };

    const displayTodo = item => (
        <TouchableOpacity
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                paddingVertical: 16,
            }}
            onPress={() =>
                Alert.alert(`${item.title}`, `${item.description}`, [
                    {
                        text: item.completed ? 'Mark InProgress' : 'Mark Completed',
                        onPress: () => updateTodo(item),
                    },
                    {
                        text: 'Ok',
                        style: 'cancel',
                    },
                ])

            }
            onLongPress={() => handleLongPress(item)}
            >
            <BouncyCheckbox
                isChecked={item.completed ? true : false}
                fillColor="black"
                onPress={() => updateTodo(item)}
            />
            <Text
                style={{
                    color: '#000',
                    width: '90%',
                    fontSize: 16,
                    textDecorationLine: item.completed ? 'line-through' : 'none',
                }}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    // sample code 
    const getRemainingTasks = () => {
        const remainingTasks = todo.filter(item => !item.completed).length;
        return remainingTasks;
    };

    return (
        <View style={{ paddingHorizontal: 10, backgroundColor: '#FBF3D5', flex: 1 }}>
            <StatusBar translucent={false} style="inverted" />
            <View
                style={{
                    paddingTop: 20,
                    paddingBottom: 15,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <View>
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}><Text style={{ color: '#F97300' }}>T</Text>odo List</Text>
                    <Text style={{ fontSize: 16, marginLeft: 12 }}>
                        {getRemainingTasks()}{getRemainingTasks() === 1 ? ' task' : ' tasks'} to do
                    </Text>
                </View>
            </View>

            <Text style={{ color: '#000', fontSize: 28, fontWeight: 'bold' }}>
                To do Tasks
            </Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View>
                    {todo.map(item => (!item.completed ? displayTodo(item) : null))}
                </View>
            </ScrollView>

            <Text style={{ color: '#000', fontSize: 28, fontWeight: 'bold' }}>
                Completed Tasks
            </Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View >
                    {todo.map(item => (item.completed ? displayTodo(item) : null))}
                </View>
            </ScrollView>

            <View style={{ width: '100%', alignItems: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => setShowModal(true)}
                    style={{
                        backgroundColor: 'grey',
                        borderRadius: 10,
                        marginRight: 10,
                        marginBottom: 30,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: width * 0.15,
                        height: height * 0.07,
                    }}>
                    <PlusIcon color='white' strokeWidth={3} size={32} />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}>
                <View style={{ paddingHorizontal: 10, backgroundColor: '#FBF3D5', flex: 1 }}>
                    <View
                        style={{
                            paddingTop: 20,
                            paddingBottom: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View>
                            <Text style={{ fontSize: 36, fontWeight: 'bold' }}><Text style={{ color: '#F97300' }}>T</Text>odo List</Text>
                        </View>

                    </View>

                    <Text
                        style={{
                            color: '#000',
                            fontSize: 28,
                            fontWeight: 'bold',
                            marginVertical: 5,
                        }}>
                        Add a Todo Item
                    </Text>
                    <TextInput
                        placeholder="Title"
                        value={newTodo.title}
                        onChangeText={title => handleChange('title', title)}
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            fontSize: 20,
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 10,
                        }}
                    />
                    <TextInput
                        placeholder="Description"
                        value={newTodo.description}
                        onChangeText={desc => handleChange('description', desc)}
                        style={{

                            backgroundColor: 'white',
                            color: 'black',
                            fontSize: 20,
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 10,
                        }}
                        multiline={true}
                        numberOfLines={4}
                    />

                    <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity
                            onPress={addTodo}
                            style={{
                                backgroundColor: 'grey',
                                height: 50,
                                width: width * 0.20,
                                borderRadius: 10,
                                alignItems: 'center',
                                padding: 10,
                                fontSize: 23,
                                fontWeight: '500',
                                color: 'grey'
                            }}>
                            <Text style={{ fontSize: 22, color: '#fff' }}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>




        </View>
    );
}