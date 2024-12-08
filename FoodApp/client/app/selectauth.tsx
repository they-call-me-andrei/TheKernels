import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

export default function Autentificare() {

    const handleSignIn = () => {
        router.push("/login");
    };

    const handleCreateAccount = () => {
        router.push("/autentificareutilizator");
    };

    const handleGuest = () => {
        router.push("/guest");
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image source={require('../assets/images/megaImage.png')} style={styles.logo} />
                <Text style={styles.title}>Rapid și ușor, cumpărături fără griji!</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleGuest}>
                        <Text style={styles.buttonText}>Oaspete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor:"white"
    },
    logo: {
        width: 160,
        height: 160,
        marginBottom: 20, 
        borderRadius: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "500",
        color: "#281b52",
        marginBottom: 20,
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 60,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 200,
        height: 50,
        marginVertical: 10,
        backgroundColor: "#e30613",
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: "500",
        color: "#ffffff"
    }
});