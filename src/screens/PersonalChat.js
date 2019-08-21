import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, AsyncStorage, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'

export default class App extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name')
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            name: props.navigation.getParam('name'),
            avatar: props.navigation.getParam('avatar'),
            status: props.navigation.getParam('status'),
            uid: props.navigation.getParam('id'),
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
    componentWillMount = async () => {
        this.setState({
            myid: await AsyncStorage.getItem('userid')
        })
        firebase.database().ref('message').child(this.state.myid).child(this.state.uid)
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
        // console.warn("item", item)
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: 'auto',
                    alignSelf: item.from === this.state.myid ? 'flex-end' : 'flex-start',
                    backgroundColor: item.from === this.state.myid ? '#00897b' : '#7cb342',
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
        const { myid, uid } = this.state
        if (this.state.textMessage.length > 0) {
            let msgid = firebase.database().ref('message').child(myid).child(uid).push().key;
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: myid
            }
            updates['message/' + myid + '/' + uid + '/' + msgid] = message
            updates['message/' + uid + '/' + myid + '/' + msgid] = message
            firebase.database().ref().update(updates);
            this.setState({ textMessage: '' });
        }
    }

    render() {
        // console.warn("item", this.state.status)
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.arrow} onPress={() => this.props.navigation.navigate('Friend')}>
                        <Icon size={30} name={'md-arrow-back'} style={{ color: "grey" }} />
                    </TouchableOpacity>
                    <Image style={styles.image} source={require('../assets/user.png')} />
                    <View style={styles.headerLeft}>
                        <Text style={styles.name}>{this.state.name}</Text>
                        <Text style={styles.status}>{this.state.status}</Text>
                    </View>
                    <TouchableOpacity style={styles.locate} onPress={() => this.props.navigation.navigate('Nearby')}>
                        <Icon size={30} name={'md-locate'} style={{ color: "grey" }} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{ padding: 10, height: '80%' }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(Item, index) => index.toString()}
                />
                <View style={{ height: '10%', backgroundColor: 'rgba(7, 171, 18,0.8)', position: 'relative', marginBottom: 400 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput style={styles.input}
                            value={this.state.textMessage}
                            placeholder="Type Message Here..."
                            onChangeText={this.handleOnChange('textMessage')}
                        />
                        <TouchableOpacity onPress={this.sendMessage}>
                            <Icon size={40} name={'md-send'} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: -3 }}>
                        <TouchableOpacity onPress={() => alert('yee masih belum bisa dipake nih..')}>
                            <Text style={styles.autoText}>Lagi ngapain!!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => alert('yee masih belum bisa dipake nih..')}>
                            <Text style={styles.autoText}>Sudah Makan!!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => alert('yee masih belum bisa dipake nih..')}>
                            <Text style={styles.autoText}>Sama Siapa!!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => alert('yee masih belum bisa dipake nih..')}>
                            <Text style={styles.autoText}>....</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: 'white'
    },
    header: {
        height: 65,
        backgroundColor: 'white',
        elevation: 2,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    arrow: {
        alignItems: 'flex-start',
        marginLeft: 20
    },
    locate: {
        alignItems: 'flex-end'
    },
    image: {
        width: 40,
        height: 40,
        marginLeft: 15
    },
    headerLeft: {
        width: '60%',
        marginLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center'

    },
    name: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#333'
    },
    status: {
        fontSize: 16,
        marginTop: -3
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
    autoText: {
        padding: 5,
        marginTop: -3,
        marginRight: 10,
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.8)'
    }
});
