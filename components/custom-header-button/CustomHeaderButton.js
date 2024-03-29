import React from "react";
import { Platform } from "react-native";
import { HeaderButton, Item } from "react-navigation-header-buttons";
import { Ionicons,SimpleLineIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={SimpleLineIcons}
      iconSize={22}
      color={Colors.blackPrimary}
    />
  );
};

export default CustomHeaderButton;
