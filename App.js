import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function App() {
  const [origin, setOrigin] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    userList();
    return () => {};
  }, []);
  const userList = () => {
    const url = "https://jsonplaceholder.typicode.com/users";
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilter(responseJson);
        setOrigin(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const itemView = ({ item }) => {
    return (
      <Text style={styles.component}>
        {item.id}
        {". "}
        {item.name}
      </Text>
    );
  };
  const itemSeparatorView = () => {
    return <View style={styles.seperator} />;
  };
  const searchFilter = (text) => {
    if (text) {
      const newData = origin.filter((item) => {
        const itemData = item.name ? item.name : "";
        return itemData.indexOf(text) > -1;
      });
      setFilter(newData);
      setSearch(text);
    } else {
      setFilter(origin);
      setSearch(text);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.inputStyle}
          value={search}
          placeholder="Search the name"
          onChangeText={(text) => searchFilter(text)}
        />
      </View>
      <FlatList
        data={filter}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={itemSeparatorView}
        renderItem={itemView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },

  seperator: {
    height: 2,
    width: "30%",
    backgroundColor: "#808080",
    marginLeft: "35%",
  },

  component: {
    padding: 15,
  },

  inputStyle: {
    height: 50,
    width: "90%",
    marginLeft: "5%",
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "black",
    backgroundColor: "white",
  },

  inputLocation: {
    width: "90%",
    marginLeft: "5",
  },
});
