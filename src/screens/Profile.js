import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { Auth, Database, Storage } from '../config/firebase'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class App extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            myid: '',
            imgSource: '',
        }
        AsyncStorage.getItem('userid', (error, result) => {
            if (result) {
                this.setState({
                    myid: result
                })
            }
        })
    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        }

        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                this.setState({ imgSource: response })
            }
        })
    }

    _logOut = async () => {
        // console.warn("userid", this.state.myid)
        Database.ref('/users/' + this.state.myid).update({ status: 'offline' })
        Auth.signOut().then(() => {
            AsyncStorage.clear();
            this.props.navigation.navigate('SplashScreen')
        })
            .catch((error) => {
                alert('error', error.message)
            })
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        let dbRef = Database.ref('users');
        let myid = await AsyncStorage.getItem('userid');
        dbRef.on('child_added', (val) => {
            let person = val.val();

            if (person.id === myid) {
                this.setState((prevState) => {
                    return {
                        data: [...prevState.data, person]
                    }
                })
            }

        })
    }

    uploadImage = (uri, imgSource, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
            const uploadUri = uri
            let uploadBlob = null

            const imageRef = Storage.ref('posts').child(imgSource)
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                    uploadBlob = blob
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    resolve(url)
                    Database.ref('/users/' + this.state.myid).update({ avatar: url })
                    this.setState({
                        imgSource: ''
                    })
                    alert('Foto Profile Berhasil di update')
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    render() {
        const { imgSource } = this.state
        return (
            <View style={styles.container}>
                {
                    this.state.data.map(user => {
                        return (
                            <View style={styles.layProfile}>
                                {
                                    this.state.imgSource !== ''
                                        ?
                                        <View style={styles.layPhoto}>
                                            <Image style={styles.photo} source={{ uri: imgSource.uri }} />
                                        </View>
                                        :
                                        <View style={styles.layPhoto}>
                                            <TouchableOpacity onPress={this.handleChoosePhoto}>
                                                <Image style={styles.photo} source={{ uri: user.avatar }} />
                                            </TouchableOpacity>
                                        </View>
                                }

                                <View style={{ alignItems: 'center', marginTop: -30 }}>
                                    <View style={styles.information}>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Status</Text>
                                            <Text style={styles.textUser}>{user.status}</Text>
                                        </View>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Name</Text>
                                            <Text style={styles.textUser}>{user.name}</Text>
                                        </View>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Email</Text>
                                            <Text style={styles.textUser}>{user.email}</Text>
                                        </View>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Phone</Text>
                                            <Text style={styles.textUser}>{user.phone}</Text>
                                        </View>
                                    </View>
                                    {
                                        this.state.imgSource === ''
                                            ?
                                            <TouchableOpacity onPress={this._logOut} style={styles.layLogout}>
                                                <Text style={styles.logout}>Logout</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => this.uploadImage(imgSource.uri, imgSource.fileName)} style={styles.laySave}>
                                                <Text style={styles.save}>Save</Text>
                                            </TouchableOpacity>
                                    }

                                </View>

                            </View>
                        )
                    })

                }

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
    layPhoto: {
        width: '100%',
        height: '60%',
    },
    photo: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    butSave: {
        paddingHorizontal: 10,
        backgroundColor: 'red',
        flex: 1
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
    layLogout: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '90%',
        opacity: .85
    },
    logout: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    laySave: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '90%',
        opacity: .85
    },
    save: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    }

});
