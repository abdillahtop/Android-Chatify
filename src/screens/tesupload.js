import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    AsyncStorage,
    Dimensions,
    ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4'; // Import UUID to generate UUID

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
const ImageRow = ({ image, windowWidth, popImage }) => (
    <View>
        <Image
            source={{ uri: image }}
            style={[styles.img, { width: windowWidth / 2 - 15 }]}
            onError={popImage}
        />
    </View>
);
export default class App extends Component {
    state = {
        imgSource: '',
        uploading: false,
        progress: 0,
        images: []
    };
    componentDidMount() {
        let images;
        AsyncStorage.getItem('images')
            .then(data => {
                images = JSON.parse(data) || [];
                this.setState({
                    images: images
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    /**
     * Select image method
     */
    pickImage = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imgSource: source,
                    imageUri: response.uri
                });
            }
        });
    };
    /**
     * Upload image method
     */
    uploadImage = () => {
        const ext = this.state.imageUri.split('.').pop(); // Extract image extension
        const imagedir = this.state.imgSource
        const filename = `${uuid()}.${ext}`; // Generate unique name
        const file = require('../assets/logo.png')
        console.warn("tes name", filename)
        console.warn("tes dircetory", imagedir)
        firebase.storage().ref().put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });

        // this.setState({ uploading: true });
        // let uploadTask = firebase.storage().ref().child('images/' + filename).put(imagedir);

        // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        //     function (snapshot) {
        //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //         console.log('Upload is ' + progress + '% done');
        //         switch (snapshot.state) {
        //             case firebase.storage.TaskState.PAUSED: // or 'paused'
        //                 console.log('Upload is paused');
        //                 break;
        //             case firebase.storage.TaskState.RUNNING: // or 'running'
        //                 console.log('Upload is running');
        //                 break;
        //         }
        //     }, function (error) {

        //         // A full list of error codes is available at
        //         // https://firebase.google.com/docs/storage/web/handle-errors
        //         switch (error.code) {
        //             case 'storage/unauthorized':
        //                 // User doesn't have permission to access the object
        //                 break;

        //             case 'storage/canceled':
        //                 // User canceled the upload
        //                 break;

        //             case 'storage/unknown':
        //                 // Unknown error occurred, inspect error.serverResponse
        //                 break;
        //         }
        //     }, function () {
        //         // Upload completed successfully, now we can get the download URL
        //         uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //             console.log('File available at', downloadURL);
        //         });
        //     });

    };
    /**
     * Remove image from the state and persistance storage
     */
    removeImage = imageIndex => {
        let images = this.state.images;
        images.pop(imageIndex);
        this.setState({ images });
        AsyncStorage.setItem('images', JSON.stringify(images));
    };
    render() {
        const { uploading, imgSource, progress, images } = this.state;
        const windowWidth = Dimensions.get('window').width;
        const disabledStyle = uploading ? styles.disabledBtn : {};
        const actionBtnStyles = [styles.btn, disabledStyle];
        return (
            <View>
                <ScrollView>
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={actionBtnStyles}
                            onPress={this.pickImage}
                            disabled={uploading}
                        >
                            <View>
                                <Text style={styles.btnTxt}>Pick image</Text>
                            </View>
                        </TouchableOpacity>
                        {/** Display selected image */}
                        {imgSource !== '' && (
                            <View>
                                <Image source={imgSource} style={styles.image} />
                                {uploading && (
                                    <View
                                        style={[styles.progressBar, { width: `${progress}%` }]}
                                    />
                                )}
                                <TouchableOpacity
                                    style={actionBtnStyles}
                                    onPress={this.uploadImage}
                                    disabled={uploading}
                                >
                                    <View>
                                        {uploading ? (
                                            <Text style={styles.btnTxt}>Uploading ...</Text>
                                        ) : (
                                                <Text style={styles.btnTxt}>Upload image</Text>
                                            )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View>
                            <Text
                                style={{
                                    fontWeight: '600',
                                    paddingTop: 20,
                                    alignSelf: 'center'
                                }}
                            >
                                {images.length > 0
                                    ? 'Your uploaded images'
                                    : 'There is no image you uploaded'}
                            </Text>
                        </View>
                        <FlatList
                            numColumns={2}
                            style={{ marginTop: 20 }}
                            data={images}
                            renderItem={({ item: image, index }) => (
                                <ImageRow
                                    windowWidth={windowWidth}
                                    image={image}
                                    popImage={() => this.removeImage(index)}
                                />
                            )}
                            keyExtractor={index => index}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5
    },
    btn: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        backgroundColor: 'rgb(3, 154, 229)',
        marginTop: 20,
        alignItems: 'center'
    },
    disabledBtn: {
        backgroundColor: 'rgba(3,155,229,0.5)'
    },
    btnTxt: {
        color: '#fff'
    },
    image: {
        marginTop: 20,
        minWidth: 200,
        height: 200,
        resizeMode: 'contain',
        backgroundColor: '#ccc',
    },
    img: {
        flex: 1,
        height: 100,
        margin: 5,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#ccc'
    },
    progressBar: {
        backgroundColor: 'rgb(3, 154, 229)',
        height: 3,
        shadowColor: '#000',
    }
});