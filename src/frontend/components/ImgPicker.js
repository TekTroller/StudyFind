import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import Colors from "../assets/Colors";

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState();

  const verifyCameraPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const verifyLibraryPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (result.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant library permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyCameraPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    console.log(image);
    setPickedImage(image.uri);
    props.onImageTaken(image.base64);
  };

  const selectImageHandler = async () => {
    const hasPermission = await verifyLibraryPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setPickedImage(image.uri);
    props.onImageTaken(image.base64);
  };

  return (
    <View style={styles.imagePicker}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={props.titleChangeHandler}
        value={props.titleValue}
      />
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.studyFindGray,
          width: 300,
          alignSelf: "center",
          alignItems: "center",
          height: 40,
          borderRadius: 4,
          marginBottom: 15,
          flexDirection: "row",
        }}
        onPress={takeImageHandler}
      >
        <Ionicons
          name="camera"
          color="black"
          size={30}
          style={{ marginLeft: 10, marginRight: 10 }}
        />
        <Text
          style={{
            color: "black",
            fontSize: 16,
            marginLeft: 55,
          }}
        >
          Take a Photo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.studyFindGray,
          width: 300,
          alignSelf: "center",
          alignItems: "center",
          height: 40,
          borderRadius: 4,
          marginBottom: 15,
          flexDirection: "row",
        }}
        onPress={selectImageHandler}
      >
        <Ionicons
          name="image"
          color="black"
          size={30}
          style={{ marginLeft: 10, marginRight: 20 }}
        />
        <Text style={{ color: "black", fontSize: 16, marginLeft: 16 }}>
          Choose from Library
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: 350,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    width: "100%",
  },
  textInput: {
    borderBottomColor: Colors.studyFindGray,
    borderBottomWidth: 2,
    marginBottom: 15,
    height: 20,
    width: "100%",
  },
});

export default ImgPicker;
