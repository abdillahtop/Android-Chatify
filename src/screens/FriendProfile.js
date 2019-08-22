import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import firebase from 'firebase'

export default class FirendProfile extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', null)
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            item: [],
            id: props.navigation.getParam('id'),
            name: props.navigation.getParam('name'),
            avatar: props.navigation.getParam('avatar'),
            email: props.navigation.getParam('email'),
            status: props.navigation.getParam('status'),
            phone: props.navigation.getParam('phone'),

        }
        AsyncStorage.getItem('userid', (error, result) => {
            if (result) {
                this.setState({
                    myid: result
                })
            }
        })
    }

    componentWillMount = async () => {
        this.getAlldata()
    }

    getAlldata = async () => {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            if (person.id === this.state.id) {
                this.setState((prevState) => {
                    return {
                        item: [...prevState.item, person]
                    }
                })
            }
        })
    }

    render() {
        // console.warn("list item1", this.state.item)
        return (
            <View style={styles.container}>
                <View style={styles.layProfile}>
                    <Image style={styles.photo} source={{ uri: this.state.avatar }} />
                    <View style={{ alignItems: 'center', marginTop: -30 }}>
                        <View style={styles.information}>
                            <View style={styles.layText}>
                                <Text style={styles.textTag}>Status</Text>
                                <Text style={styles.textUser}>{this.state.status}</Text>
                            </View>
                            <View style={styles.layText}>
                                <Text style={styles.textTag}>Name</Text>
                                <Text style={styles.textUser}>{this.state.name}</Text>
                            </View>
                            <View style={styles.layText}>
                                <Text style={styles.textTag}>Email</Text>
                                <Text style={styles.textUser}>{this.state.email}</Text>
                            </View>
                            <View style={styles.layText}>
                                <Text style={styles.textTag}>Phone</Text>
                                <Text style={styles.textUser}>{this.state.phone}</Text>
                            </View>
                            {
                                this.state.item.map(data => {
                                    return (
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('PersonalChat', data)} style={styles.layMessage}>
                                            <Text style={styles.message}>Message</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    layProfile: {
        width: '100%'
    },
    logo: {
        marginTop: -50,
        scaleX: 0.4,
        scaleY: 0.4
    },
    photo: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
    },
    textTag: {
        fontSize: 16,
        color: '#888',
        fontWeight: '400',
        width: '30%'
    },
    textUser: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        textAlign: 'right',
        width: '70%'
    },
    information: {
        width: '90%',
        height: 'auto',
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    layText: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.4
    },
    layMessage: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '100%',
    },
    message: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    }

});
