import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, TextInput, } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import User from '../User'
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'

export default class App extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Personal'
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            person: {
                userid: props.navigation.getParam('userid'),
                name: props.navigation.getParam('name')
            },
            textMessage: '',
            messageList: []
        }
    }

    convertTIme = (time) => {
        let d = new Date(time)
        let c = new Date()
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':'
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + '' + result;
        }
        return result;
    }
    componentWillMount() {
        firebase.database().ref('message').child(User.email).child(this.state.person.email)
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })
            })
    }

    handleOnChange = key => val => {
        this.setState({ [key]: val })
    }

    renderRow = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: 'auto',
                    alignSelf: item.from === User.email ? 'flex-end' : 'flex-start',
                    backgroundColor: item.from === User.email ? '#00897b' : '#7cb342',
                    borderRadius: 5,
                    marginBottom: 10
                }}
            >
                <Text style={{ color: '#ff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Text style={{ color: '#eee', padding: 3, fontSize: 12 }}>
                    {this.convertTIme(item.time)}
                </Text>
            </View>
        )
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgid = firebase.database().ref('message').child(User.email).child(this.state.person.email).push().key;
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.email
            }
            updates['message/' + User.email + '/' + this.state.person.email + '/' + msgid] = message
            updates['message/' + this.state.person.email + '/' + User.email + '/' + msgid] = message
            firebase.database().ref().update(updates);
            this.setState({ textMessage: '' });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <FlatList
                    style={{ padding: 10, height: '90%' }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(Item, index) => index.toString()}
                />
                <View style={{ flexDirection: 'row', height: '10%', backgroundColor: 'rgba(7, 171, 18,0.8)', position: 'relative' }}>
                    <TextInput style={styles.input}
                        value={this.state.textMessage}
                        placeholder="Type Message Here..."
                        onChangeText={this.handleOnChange('textMessage')}
                    />
                    <TouchableOpacity onPress={this.sendMessage}>
                        <Icon size={40} name={'md-send'} style={styles.icon} />
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: 'white'
    },
    input: {
        marginBottom: 15,
        padding: 10,
        marginLeft: 5,
        borderWidth: 0.5,
        borderColor: '#ddd',
        marginTop: 10,
        borderTopColor: '#aaa',
        width: '85%',
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5
    },
    icon: {
        color: 'white',
        marginLeft: 10,
        marginTop: 10

    },
});
