import React, { useState } from "react";
import { Image, View } from "react-native";

const RecordDetailScreen = (props) => {
  const [ratio, setRatio] = useState(1);
  const imageUri = props.navigation.getParam("imageUri");

  Image.getSize(imageUri, (width, height) => {
    setRatio(width / height);
  });
  return (
    <View>
      <Image
        style={{ width: "100%", height: undefined, aspectRatio: ratio }}
        resizeMode="contain"
        source={{ uri: imageUri }}
      />
    </View>
  );
};

RecordDetailScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam("title");
  return {
    headerTitle: title,
  };
};

export default RecordDetailScreen;
