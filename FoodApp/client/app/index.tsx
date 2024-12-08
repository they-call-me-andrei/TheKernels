import { Text, View, SafeAreaView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.hero}>
                <Image source={require("../assets/images/supermarket.png")} style={styles.heroImg}></Image>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mega Image{"\n"}
                        <Text style={styles.appName}>
                            <Text style={styles.appNameText}>#ScanAndGoMega</Text>
                        </Text>
                    </Text>
                    <Text style={styles.message}>Rapiditate si confort, simplificând cumpărăturile tale zilnice, direct de pe telefonul mobil.</Text>
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleNext}>
                    <Text style={styles.btnText}>Să începem</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function handleNext() {
    router.push("/selectauth");
}

const styles = StyleSheet.create({
    content: {
        padding: 24,
        justifyContent: "space-between",
        flex: 1
    },
    header: {
        paddingHorizontal: 8
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        color: "#281b52",
        textAlign: "center",
        lineHeight: 42,
        marginBottom: 12
    },
    message: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: "400",
        color: "#9992a7",
        textAlign: "center"
    },
    hero: {
        backgroundColor: "#ffd6d6",
        borderRadius: 18,
        margin: 25,
        overflow: "hidden",
        marginTop: 90
    },
    heroImg: {
        width: "100%",
        height: 350,
    },
    appName: {
        backgroundColor: "#fff2dd",
        paddingHorizontal: 6,
        transform: [
            {
                rotate: "-5deg"
            }
        ]
    },
    appNameText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#281b52"
    },
    btn: {
        backgroundColor: "#e30613", // Culoare roșie
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12
    },
    btnText: {
        fontSize: 17,
        fontWeight: "500",
        color: "#fff"
    }
});