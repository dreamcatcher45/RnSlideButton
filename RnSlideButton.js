import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Image } from 'react-native';

const RnSlideButton = ({
  onSlideComplete,
  width = 300,
  height = 50,
  backgroundColor = '#2ecc71',
  textColor = '#ffffff',
  text = 'Slide To Save',
  thumbColor = '#ffffff',
  iconColor = '#2ecc71',
  shadowColor = '#000', 
  shadowOffset = { width: 0, height: 2 }, 
  shadowOpacity = 0.2, 
  shadowRadius = 2, 
  iconSize = 24,
  iconPath,
}) => {
  const [sliderWidth, setSliderWidth] = useState(width);
  const translateX = useRef(new Animated.Value(0)).current;

  const resetSlider = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newPosition = Math.max(0, Math.min(touchX - height / 2, sliderWidth - height));
        translateX.setValue(newPosition);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newValue = Math.max(0, Math.min(gestureState.moveX - height / 2, sliderWidth - height));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (translateX._value > sliderWidth * 0.8) {
          Animated.timing(translateX, {
            toValue: sliderWidth - height,
            duration: 100,
            useNativeDriver: true,
          }).start(() => {
            onSlideComplete();
            resetSlider();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor,
          shadowColor,
          shadowOffset,
          shadowOpacity,
          shadowRadius,
        },
      ]}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: height - 4,
            height: height - 4,
            backgroundColor: thumbColor,
            transform: [{ translateX }],
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        {iconPath ? (
          <Image
            source={iconPath}
            style={{ width: iconSize, height: iconSize, tintColor: iconColor }}
          />
        ) : (
          <Text style={[styles.icon, { color: iconColor, fontSize: iconSize }]}>➜</Text>
        )}
      </Animated.View>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
    padding: 2,
    elevation: 2,
  },
  thumb: {
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
});

export default RnSlideButton;
