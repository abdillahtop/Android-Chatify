import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, FlatList, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Auth, Database } from '../config/firebase'
import Icon from 'react-native-vector-icons/Ionicons';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            uid: null
        }

    }

    componentWillMount = async () => {
        let dbRef = Database.ref('users');
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
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PersonalChat', item)}
                style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }


    render() {
        console.warn("selain usaer")
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image style={styles.logo} source={require('../assets/logo.png')} />
                        <Text style={styles.logoText}>Chatify</Text>
                    </View>
                    <View style={styles.headerRight} >
                        <TouchableOpacity>
                            <Icon size={30} name={'md-search'} style={styles.find} />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={this.state.users}
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
    logoText: {
        marginLeft: -50,
        fontWeight: '900',
        marginTop: 13,
        fontSize: 22,
        color: '#333'
    },
    header: {
        height: 55,
        backgroundColor: 'white',
        elevation: 2,
    },
    headerLeft: {
        flexDirection: "row"
    },
    headerRight: {
        marginTop: -125,
        marginRight: 20,
        alignItems: 'flex-end'
    },
    flatlist: {
        paddingVertical: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: '900',
        marginLeft: 20
    }
});
