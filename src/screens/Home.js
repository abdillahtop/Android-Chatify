import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons';
import user from '../User';

export default class App extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            users: []
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true }, this.getData)
    }

    getData = async () => {
        const url = 'https://jsonplaceholder.typicode.com/photos/?_limit=10'
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                // console.warn('dari respon json', responseJson)
                this.setState({
                    data: responseJson
                })
            })

    }


    _renderItem = ({ item }) => (
        <TouchableOpacity>
            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 10 }}>
                <View>
                    <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: item.thumbnailUrl }} />
                </View>
                <View style={{ marginLeft: 10, width: 270 }}>
                    <Text style={{ color: 'black' }}>{item.title}</Text>
                    <Text style={{ color: 'black' }}>{item.title}</Text>
                </View>
                <View style={{ borderBottomWidth: 3, borderColor: 'black' }} />
            </View>
        </TouchableOpacity>
    );

    // renderRow = ({ item }) => {
    //     // console.warn("item", item)
    //     return (
    //         <TouchableOpacity
    //             style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}
    //             onPress={() => this.props.navigation.navigate('PersonalChat', item)}>
    //             <View>
    //                 <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={require('../assets/user.png')} />
    //             </View>
    //             <Text style={styles.name}>{item.email}</Text>
    //         </TouchableOpacity>
    //     )
    // }

    render() {
        // console.warn("users", this.state.users)
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
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
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
