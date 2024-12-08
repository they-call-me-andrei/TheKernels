import { Alert, StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { IP } from "@/data/ip";
import { RNCamera } from 'react-native-camera';

export default function Autentificare() {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [emailVerify, setEmailVerify] = useState(false);
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [firstEmail, setFirstEmail] = useState(true);
    const [firstPassword, setFirstPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

    function handleEmail(email) {
        setFirstEmail(false);
        setForm({ ...form, email });
        if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/.test(email)) {
            setEmailVerify(true);
        } else {
            setEmailVerify(false);
        }
    }

    function handlePassword(password) {
        setFirstPassword(false);
        setForm({ ...form, password });
        if (password.length > 0) {
            setPasswordVerify(true);
        } else {
            setPasswordVerify(false);
        }
    }

    const handleSubmit = async () => {
        if (emailVerify === true && passwordVerify === true) {

            var apiURL = `http://${IP}:5555/utilizator/login`;

            try {
                setLoading(true);
                const response = await axios.post(apiURL, {
                    "email": form.email,
                    "password": form.password
                }).then(function (response) {
                    var responseMsg = response.data.data;
                    if (responseMsg == "Nu exista niciun utilizator cu acest email!") {
                        Alert.alert(":(", responseMsg, [{ text: "Ok" }])
                    } else if (responseMsg == "Corect") {

                        router.push({
                            pathname: "/mainpage",
                            params: {
                                idUtilizator: response.data.idUtilizator
                            }
                        });

                    } else {
                        Alert.alert(":(", "Combinație email-parolă greșită.", [{ text: "Ok" }])
                    }
                    setLoading(false)
                }).catch(function (error) {
                    Alert.alert(":(", "Combinație email-parolă greșită.", [{ text: "Ok" }])
                    setLoading(false);
                })

            } catch (error) {

            }
        } else {
            Alert.alert(":(", "Toate câmpurile obligatorii trebuie completate corect!", [{ text: "Ok" }])
        }

    }

    const handleBarCodeRead = ({ data }) => {
        setShowBarcodeScanner(false);
        router.push({
            pathname: "/mainpage",
            params: {
                idUtilizator: data
            }
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={require('../assets/images/login.png')} alt="Logo" style={styles.headerImg} />
                    </View>
                    <Text style={styles.title}>
                        Autentificare
                    </Text>
                    <Text style={styles.subtitle}>
                        Intră în cont și bucură-te de aplicatia noastra!
                    </Text>

                    <View>
                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>
                                Adresă email {emailVerify ? (
                                    <Image source={require('../assets/images/accepted.png')} alt="Logo" style={styles.img} />
                                ) : (
                                    null
                                )}
                            </Text>
                            <TextInput autoCorrect={false} autoCapitalize="none" keyboardType="email-address" placeholder="Completează email" style={styles.inputControl} value={form.email} onChangeText={email => handleEmail(email)}></TextInput>
                            {firstEmail == true ? null : emailVerify ? (
                                null
                            ) : (
                                <Text style={{ color: "red", marginTop: 3 }}>
                                    Email-ul nu are formatul corect!
                                </Text>
                            )}
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>
                                Parolă {passwordVerify ? (
                                    <Image source={require('../assets/images/accepted.png')} alt="Logo" style={styles.img} />
                                ) : (
                                    null
                                )}
                            </Text>
                            <TextInput secureTextEntry placeholder="Completează parola" style={styles.inputControl} value={form.password} onChangeText={password => handlePassword(password)}></TextInput>
                            {firstPassword == true ? null : passwordVerify ? (
                                null
                            ) : (
                                <Text style={{ color: "red", marginTop: 3 }}>
                                    Introduceți parola!
                                </Text>
                            )}
                        </View>

                        <View style={styles.formAction}>
                            <TouchableOpacity onPress={handleSubmit}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Login</Text>
                                </View>
                            </TouchableOpacity>
                            {loading ? (
                                <ActivityIndicator style={{ alignSelf: "center", marginTop: 5 }} />
                            ) : (
                                null
                            )}
                        </View>
                        <Text style={styles.orText}>sau scanează <Text style={styles.scanButton} onPress={() => setShowBarcodeScanner(true)}>cardul connect</Text> </Text>
                    </View>
                </View>
            </ScrollView>
            <Modal visible={showBarcodeScanner} animationType="slide">
                <View style={styles.modalContainer}>
                    <RNCamera
                        style={styles.camera}
                        onBarCodeRead={handleBarCodeRead}
                        captureAudio={false}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowBarcodeScanner(false)}>
                        <Text style={styles.closeButtonText}>Anulează</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    img: {
        width: 15,
        height: 15
    },
    error: {
        marginTop: 5
    },
    container: {
        padding: 24,
        flex: 1,
        marginTop: 50
    },
    header: {
        marginVertical: 30,
    },
    headerImg: {
        width: 80,
        height: 80,
        alignSelf: "center"
    },
    title: {
        fontSize: 27,
        fontWeight: "700",
        color: "#1e1e1e",
        marginBottom: 6,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "400",
        color: "929292",
        textAlign: "center",
        marginBottom: 30
    },
    input: {
        marginBottom: 16
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: "600",
        color: "#222",
        marginBottom: 6
    },
    inputControl: {
        height: 44,
        backgroundColor: "#fff",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 12,
        fontWeight: "500",
        color: "#222",
        fontSize: 15,
        borderColor: "black",
        borderWidth: 1
    },
    formAction: {
        marginVertical: 24,
    },
    btn: {
        backgroundColor: "#e30613",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e30613",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff"
    },
    formFooter: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
        textAlign: "center",
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 16,
        color: '#929292',
    },
    scanButton: {
        color: '#e30613',
        textDecorationLine: 'underline',
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    camera: {
        width: '80%',
        height: '50%',
    },
    closeButton: {
        backgroundColor: '#e30613',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});