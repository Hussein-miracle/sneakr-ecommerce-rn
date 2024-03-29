import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { SimpleLineIcons, EvilIcons, Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import CustomHeaderButton from "../../components/custom-header-button/CustomHeaderButton";
import CustomHeaderBtn from "../../components/custom-header-btn/CustomHeaderBtn";

import { addToCart } from "../../store/actions/cart.actions";

import Colors from "../../constants/Colors";
import { hex_is_light } from "../../utils";

const WIDTH = Dimensions.get("window").width;

const SneakerVariant = ({ imageUrl, extrastyle }) => {
  return (
    <View style={{ ...styles.variant, ...extrastyle }}>
      <Image source={imageUrl} style={styles.image} />
    </View>
  );
};

const ColorVariant = ({ color, handlePress, extrastyle, index }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.primaryWhite,
        width: 35,
        height: 35,
        borderRadius: 20,
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
        ...extrastyle,
      }}
    >
      <Pressable
        style={{
          width: 25,
          height: 25,
          borderRadius: 25 / 2,
          backgroundColor: color,
        }}
        onPress={() => handlePress(index)}
      ></Pressable>
    </View>
  );
};

const SneakerDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const cartItemsCount = useSelector((state) => state.cart.cartItemsCount);
  console.log(cartItemsCount, "cItemsCount");
  const { sneakerId } = route.params;
  const sneaker = useSelector((state) =>
    state.sneakers.shoes.find((sneak) => sneak.id === sneakerId)
  );

  const variants = sneaker.imgData;
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [defaultBg, setDefaultBg] = useState(variants[0].color);
  const totalLength = useRef(sneaker.imgData.length).current;
  const ratingsMap = Array.from({ length: 5 }, () => {
    return { filled: false, id: null };
  }).map((item, index) => {
    if (index < sneaker.rating) {
      item.filled = true;
    } else {
      item.filled = false;
    }
    item.id = index;
    return item;
  });

  const handleNext = () => {
    if (carouselPosition < totalLength - 1) {
      const index = carouselPosition + 1;
      const item = variants[index];
      setDefaultBg(item.color);
      setCarouselPosition(index);
    }
  };

  const handlePrev = () => {
    if (carouselPosition > 0) {
      const index = carouselPosition - 1;
      const item = variants[index];
      setDefaultBg(item.color);
      setCarouselPosition(index);
    }
  };

  const handlePressColor = (index) => {
    const item = variants[index];
    setDefaultBg(item.color);
    setCarouselPosition(index);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: sneakerId,
      title: sneaker.title,
      price: sneaker.price,
      imageUrl: variants[carouselPosition].url,
      color: variants[carouselPosition].color,
    };
    dispatch(addToCart(cartItem));
  };

  const handleBuyNow = () => {
    const orderItem = {
      id: sneakerId,
      title: sneaker.title,
      price: sneaker.price,
      imageUrl: variants[carouselPosition].url,
      color: variants[carouselPosition].color,
    };
  };

  useEffect(() => {
    navigation.setParams({
      cartCount: cartItemsCount,
    });
  }, [cartItemsCount]);

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.carousel}>
        {carouselPosition > 0 && (
          <TouchableOpacity style={styles.btn} onPress={handlePrev}>
            <EvilIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
        )}
        <View
          style={{
            ...styles.carouselMain,
            marginLeft: carouselPosition === 0 ? 30 : 0,
            marginRight: carouselPosition === totalLength - 1 ? 30 : 0,
            backgroundColor: defaultBg,
          }}
        >
          {variants.map((variant, index) => {
            const extrastyle = {
              left: (index - carouselPosition) * 0.75 * WIDTH,
            };
            return (
              <SneakerVariant
                key={index}
                imageUrl={variant.url}
                extrastyle={extrastyle}
                index={index}
                color={variant.color}
              />
            );
          })}
        </View>
        {carouselPosition < totalLength - 1 && (
          <TouchableOpacity style={styles.btn} onPress={handleNext}>
            <EvilIcons name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sneakerDetails}>
        <FlatList
          style={{
            marginVertical: 5,
          }}
          horizontal
          data={ratingsMap}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Ionicons
                name={item.filled ? "star" : "star-outline"}
                size={14}
                color={Colors.tertiary}
              />
            );
          }}
        />
        <Text style={styles.sneakerTitle}>{sneaker.title}</Text>
        <Text style={styles.sneakerPrice}>${sneaker.price}</Text>
      </View>
      <View style={styles.colorWrapper}>
        <Text style={styles.colorWrapperText}>Colour</Text>
        <View style={styles.colorVariantWrapper}>
          {
            // <FlatList  />
            variants.map((colorV, index) => {
              const extrastyle = {
                border: Colors.blackPrimary,
                borderWidth: 3,
              };
              return (
                <ColorVariant
                  color={colorV.color}
                  key={index}
                  handlePress={handlePressColor}
                  index={index}
                  extrastyle={index === carouselPosition && extrastyle}
                />
              );
            })
          }
        </View>
      </View>

      <View style={styles.detailsWrapper}>
        <View style={styles.detailsWrapperContents}>
          <Text style={styles.detailText}>Details</Text>

          <Text style={styles.shortDescription}>
            {sneaker.short_description}
          </Text>
          <Text style={styles.detailedDescription}>
            {sneaker.detailed_description}
          </Text>
        </View>
        {sneaker.productDetails.map((detail, index) => {
          const light = hex_is_light(defaultBg);
          return (
            <View
              style={{
                ...styles.productDetailsItem,
                backgroundColor: defaultBg,
              }}
              key={index}
            >
              <Text
                style={{
                  color: light ? Colors.blackPrimary : Colors.primaryWhite,
                }}
              >
                {index + 1}. {detail}
              </Text>
            </View>
          );
        })}

        <View style={styles.btnsWrapper}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartBtnText}>Add To Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
            <Text style={styles.buyNowBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export const SneakerDetailsScreenOptions = ({ route, navigation }) => {
  //console.log(route.params , 'rppp')
  const { sneakerDetailTitle, cartCount } = route.params;
  // console.log(cartCount, "count");
  const handleBack = () => {
    navigation.navigate("Products");
  };

  const handleCart = () => {
    navigation.navigate("Cart");
  };
  return {
    headerTitle: sneakerDetailTitle,
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            IconComponent={SimpleLineIcons}
            iconName="bag"
            iconSize={24}
            onPress={handleCart}
          ></Item>
          <Pressable style={styles.customHeaderRightBtn} onPress={handleCart}>
            <Text style={styles.customHeaderRightBtnText}>
              {cartCount || 0}
            </Text>
          </Pressable>
        </HeaderButtons>
      );
    },
    // headerLeft: () => {
    //   return (
    //     <HeaderButtons HeaderButtonComponent={CustomHeaderBtn}>
    //       <Item
    //         IconComponent={EvilIcons}
    //         iconName="chevron-left"
    //         iconSize={24}
    //         onPress={handleBack}
    //       />
    //     </HeaderButtons>
    //   );
    // },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  imageBg: {
    width: 90,
    height: 90,
    borderRadius: 60,
    // backgroundColor:'lightgreen',
    // backgroundColor: Colors.primaryWhiteDark,
    zIndex: -1,
  },
  image: {
    zIndex: 5,
    width: "80%",
    height: "80%",
    elevation: 5,
    transform: [{ rotate: "18deg" }],
  },
  carousel: {
    width: WIDTH,
    paddingHorizontal: 10,
    flexDirection: "row",
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  carouselMain: {
    width: WIDTH * 0.75,
    height: WIDTH * 0.75,
    backgroundColor: Colors.blackPrimary,
    borderRadius: (WIDTH * 0.75) / 2,
    zIndex: 2,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  btn: {
    backgroundColor: Colors.primaryWhite,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  variant: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    top: 25,
    // paddingHorizontal:55,
    paddingLeft: 25,
    // left:50,
  },
  sneakerDetails: {
    width: WIDTH,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sneakerTitle: {
    fontFamily: "tenor-sans",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "700",
    textAlign: "center",
  },
  sneakerPrice: {
    textAlign: "center",
    fontFamily: "tenor-sans",
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "700",
    color: Colors.secondary,
  },
  addToCartBtn: {
    width: 120,
    height: 40,
    backgroundColor: Colors.primaryWhiteDark,
    padding: 6,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 4,
  },
  addToCartBtnText: {
    color: Colors.blackPrimary,
  },
  buyNowBtn: {
    width: 120,
    height: 40,
    backgroundColor: Colors.secondary,
    padding: 6,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 4,
  },
  buyNowBtnText: {
    color: Colors.white,
  },
  btnsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 6,
    height: 0.1 * Dimensions.get("window").height,
    padding: 8,
  },
  productDetailsItem: {
    padding: 4,
    margin: 2,
    width: WIDTH * 0.99,
  },
  customHeaderRightBtn: {
    width: 18,
    height: 18,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    left: 25,
    bottom: 36,
    // top:36,
  },
  customHeaderRightBtnText: { color: Colors.primaryWhite, fontSize: 12 },
  detailedDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8C8C8D",
  },
  shortDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212121",
  },
  detailText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.blackPrimary,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: Colors.blackPrimary,
  },
  colorVariantWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent:'space-between',
  },
  colorWrapper: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  colorWrapperText: {
    fontSize: 18,
    fontWeight: "700",
  },
  detailsWrapper: {},
  detailsWrapperContents: {
    paddingHorizontal: 4,
  },
});
export default SneakerDetailsScreen;
