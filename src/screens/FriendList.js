import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, FlatList, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons';

export default class Firendlist extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            users: []
        }
    }

    componentWillMount = async () => {
        let dbRef = firebase.database().ref('users');
        // console.warn("dbref", dbRef)
        let myid = await AsyncStorage.getItem('userid');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            // console.warn("person", person)
            // console.warn("email", myid)
            if (person.id === myid) {
                myid = person.id
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    renderRow = ({ item }) => {
        // console.warn("item", item)

        return (
            <TouchableOpacity
                style={styles.contact}
                onPress={() => this.props.navigation.navigate('PersonalChat', item)}>
                <View style={{ width: '20%' }}>
                    <Image style={styles.image} source={{ uri: item.avatar }} />
                </View>
                <View style={{ width: '50%', marginLeft: 10 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.phone}>{item.phone}</Text>
                </View>
                {
                    item.status === "online"
                        ?
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={15} name={'md-radio-button-on'} style={styles.indicatorOn} />
                            <Text style={{ color: 'green' }}>{item.status}</Text>
                        </View>
                        :
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={15} name={'md-radio-button-on'} style={styles.indicatorOff} />
                            <Text>{item.status}</Text>
                        </View>
                }
            </TouchableOpacity>
        )
    }

    render() {
        // console.warn("users", this.state.users)
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.logoText}>Friend List</Text>
                </View>
                <FlatList
                    data={this.state.users}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderRow}
                    style={styles.flatlist}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logo: {
        rotation: -90,
        marginTop: -85,
        marginLeft: -50,
        scaleX: 0.2,
        scaleY: 0.2
    },
    header: {
        height: 65,
        backgroundColor: 'white',
        elevation: 2,
        alignItems: 'center',
        width: '100%'
    },
    logoText: {
        fontWeight: '900',
        marginTop: 15,
        fontSize: 28,
        alignItems: 'center',
        color: '#333'
    },
    flatlist: {
        paddingVertical: 10,
    },
    contact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.4,
        borderBottomColor: '#aaa',
        paddingVertical: 10
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 50
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        width: '50%',
        color: '#666'
    },
    indicatorOn: {
        color: 'green',
        marginRight: 5
    },
    indicatorOff: {
        color: 'grey',
        marginRight: 5
    }
});
