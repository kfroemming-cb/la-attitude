import { Picker } from "@react-native-picker/picker";
import BottomSheet from "reanimated-bottom-sheet";
import React, { useRef, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getLocationByCoordinate } from "./api";
import { Location } from "./Location";

export default function App() {
  const options = [
    {
      title: "New York",
      lat: "40.7128",
      lng: "-74.0060",
    },
    {
      title: "Shanghai",
      lat: "31.2304",
      lng: "121.4737",
    },

    {
      title: "Bellevue",
      lat: "47.6101",
      lng: "-122.2015",
    },
    {
      title: "Beijing",
      lat: "39.9042",
      lng: "116.4074",
    },
    {
      title: "Seattle",
      lat: "47.6062",
      lng: "-122.3321",
    },
  ];
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [location, setlocation] = useState("");
  const [offsetTime, setOffsetTime] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sheetRef = useRef(null);

  let submit = async () => {
    try {
      const { zoneName }: Location = await getLocationByCoordinate(lat, lng);
      const time = convert(new Date(), zoneName);
      setlocation(zoneName);
      setOffsetTime(time.toLocaleTimeString());
      setLat("");
      setLng("");
      setSelectedIndex(0);
    } catch (error) {
      setlocation("An error has occured");
      setOffsetTime("");
      setLat("");
      setLng("");
      setSelectedIndex(0);
    }
  };

  const convert = (date: Date, tzString: string): Date => {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString },
      ),
    );
  };

  const onPickerchange = (value: any) => {
    setSelectedIndex(value);
  };

  const renderPicker = () => {
    return (
      <Picker selectedValue={selectedIndex} onValueChange={onPickerchange}>
        {options.map((option, index) => (
          <Picker.Item
            label={option.title}
            value={index}
            key={index}
          ></Picker.Item>
        ))}
      </Picker>
    );
  };

  const populateForm = () => {
    const selected = options[selectedIndex];
    setLng(selected.lng);
    setLat(selected.lat);
    clearLocationAndOffset();
  };

  const clearLocationAndOffset = () => {
    setlocation("");
    setOffsetTime("");
  };

  return (
    <KeyboardAvoidingView
      style={{
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      behavior="padding"
    >
      <Text style={styles.title}>Timezone Lookup</Text>
      <Text style={styles.field}>Timezone: {location}</Text>
      <Text style={styles.field}>Local Time: {offsetTime}</Text>
      <BottomSheet
        enabledHeaderGestureInteraction
        renderHeader={() => (
          <View
            style={{
              backgroundColor: "lightgray",
            }}
          >
            <View
              style={{
                alignSelf: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                title="Done"
                onPress={() => {
                  sheetRef?.current?.snapTo(0);
                  populateForm();
                }}
              />
            </View>
          </View>
        )}
        borderRadius={10}
        ref={sheetRef}
        renderContent={renderPicker}
        snapPoints={[0, 300, 500]}
      />
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={{ ...styles.field, ...styles.input }}
          onChangeText={(v) => setLat(v)}
          value={lat}
          maxLength={10}
          placeholder="latitude"
          keyboardType="numeric"
        />
        <TextInput
          style={{ ...styles.field, ...styles.input }}
          onChangeText={(v) => setLng(v)}
          maxLength={11}
          value={lng}
          placeholder="longitude"
          keyboardType="numeric"
        />
      </View>
      <View style={{ flexDirection: "row", marginTop: 36 }}>
        <Button
          title="Get Time Info"
          onPress={submit}
          disabled={
            parseInt(lat, 10) < -90 ||
            parseInt(lat, 10) > 90 ||
            parseInt(lng) < -180 ||
            parseInt(lng) > 180 ||
            lng.length === 0 ||
            lat.length === 0
          }
        />
        <Button
          onPress={() => sheetRef?.current?.snapTo(2)}
          title="Open Samples"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    margin: 20,
  },
  field: {
    fontSize: 18,
    margin: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    fontSize: 16,
    padding: 5,
    maxWidth: 200,
    minWidth: 125,
  },
});
