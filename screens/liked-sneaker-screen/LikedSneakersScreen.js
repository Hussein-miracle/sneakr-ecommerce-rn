import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import LikedSneakr from "../../components/liked-sneakr/LikedSneakr";

const LikedSneakersScreen = () => {
  const likedSneakers = useSelector((st) => st.sneakers.shoes);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Likes</Text>
      </View>

      <View>
        <FlatList  data={likedSneakers} keyExtractor={(item) => item.id} 
        contentContainerStyle={{
          alignItems:'center',
          justifyContent:'space-evenly',
          paddingHorizontal:10,
        }}  numColumns={1} renderItem={({item}) => {
          return <LikedSneakr item={item} />
        }} />
      </View>
    </View>
  );
};

export const LikedSneakersScreenOptions = () => {
  return {
    headerTitle: "Likes",
    headerShown: true,
    tabLabelShown: !false,
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: "lightgreen",
    color: Colors.blackPrimary,
    paddingTop: 60,
    // paddingHorizontal: 2,
  },
  header: {
    justifyContent:'center',
    alignItems:'center',
    height:'5%',
    backgroundColor:Colors.secondary,
  },
  headerText: { 
    color: Colors.primaryWhite,

  },
});

export default LikedSneakersScreen;