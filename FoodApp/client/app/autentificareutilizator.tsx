import { Text, View, SafeAreaView, StyleSheet, Image, TextInput, ScrollView, Pressable, Platform, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import {Link, router } from "expo-router"
import { useState } from "react";
import axios from "axios";
import { IP } from "@/data/ip";

export default function Index() {

    const [form, setForm] = useState({
        email: "",
        emailAgain:"",
        password:"",
        passwordAgain:"",
        nume:"",
        prenume:"",
    });

    const [emailVerify,setEmailVerify] = useState(false);
    const [emailAgainVerify,setEmailAgainVerify] = useState(false);
    const [passwordVerify,setPasswordVerify] = useState("Parola trebuie să aibă minim 6 caractere!");
    const [passwordAgainVerify,setPasswordAgainVerify] = useState(false);
    const [numeVerify,setnumeVerify] = useState(false);
    const [prenumeVerify,setPrenumeVerify] = useState(false);


    const [firstemail,setFirstEmail] = useState(true)
    const [firstEmailAgain,setFirstEmailAgain] = useState(true)
    const [firstPassword,setFirstPassword] = useState(true)
    const [firstPasswordAgain,setFirstPasswordAgain] = useState(true)
    const [firstNume,setFirstNume] = useState(true)
    const [firstPrenume,setFirstPrenume] = useState(true)

    const [loading, setLoading] = useState(false);  

    const handleSubmit = async () =>{
        if(emailVerify === true && emailAgainVerify === true && passwordVerify == "ok" && passwordAgainVerify === true ){
            const apiUrl = `http://${IP}:5555/utilizator/register`
            try {
                setLoading(true);
                const response = await axios.post(apiUrl,{
                    "email":form.email,
                    "password":form.password,
                    "nume":form.nume,
                    "prenume":form.prenume,
                }).then(function(response){
                    var responseMsg = response.data.data;
                    if(responseMsg == "Exista deja un utilizator cu acest email."){
                        Alert.alert(":(", responseMsg, [{text:"Ok"}])
                    }else{
                        Alert.alert("Woohoo!", "Cont înregistrat cu succes.", [{text:"Ok"}])
                        redirect();
                    }
                    setLoading(false)
                    
                }).catch(function(error){
                    Alert.alert(":(", "A aparut o eroare", [{text:"Ok"}])
                    setLoading(false);
                })

            } catch (error) {
                
            }
        }else{
            Alert.alert(":(", "Toate câmpurile obligatorii trebuie completate corect!", [{text:"Ok"}])
        }
    }

    function redirect(){
        router.push({
            pathname:"/login"
        });
    }

    function handleNume(nume){
        setFirstNume(false)
        setForm({...form,nume})
        if(nume.length > 0){
            setnumeVerify(true);
        }else{
            setnumeVerify(false)
        }
    }

    function handlePrenume(prenume){
        setFirstPrenume(false);
        setForm({...form,prenume})
        if(prenume.length > 0){
            setPrenumeVerify(true);
        }else{
            setPrenumeVerify(false)
        }
    }

    function handleEmail(email){ 
        setFirstEmail(false);   
        setForm({...form,email})
        if(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/.test(email)){
            setEmailVerify(true);            
        }else{
            setEmailVerify(false);
        }

        if(email != form.emailAgain){
            setEmailAgainVerify(false);
        }else{
            setEmailAgainVerify(true);
        }
    }

    function handleEmailAgain(emailAgain){    
        setFirstEmailAgain(false);
        setForm({...form,emailAgain})

        if(emailAgain === form.email){
            setEmailAgainVerify(true);
        }else{
            setEmailAgainVerify(false);
        }
    }


    function handlePassword(password){
        setFirstPassword(false);
        setForm({...form,password})
        if (password.length < 6) {
            setPasswordVerify("Parola trebuie să aibă minim 6 caractere!")
        } else if (password.length > 50) {
            setPasswordVerify("Parola este prea lungă!")
        } else if (password.search(/\d/) == -1) {
            setPasswordVerify("Parola trebuie să aibă minim o cifră!")
        }else{
            setPasswordVerify("ok")
        }

        if(password != form.passwordAgain){
            setPasswordAgainVerify(false);
        }else{
            setPasswordAgainVerify(true);
        }
    }

    function handlePasswordAgain(passwordAgain){
        setFirstPasswordAgain(false);
        setForm({...form,passwordAgain})
        if(passwordAgain === form.password){
            setPasswordAgainVerify(true);
        }else{
            setPasswordAgainVerify(false);
        }
    }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/images/inregistrare.png')} alt = "Logo" style={styles.headerImg}>

                </Image>
            </View>
            <Text style={styles.title}>
                Creează cont
            </Text>
            <Text style={styles.subtitle}>
                Fii membru al platformei noastre!
            </Text>

            <View>
                <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                        Adresă email {emailVerify ? (
                                <Image source={require('../assets/images/accepted.png')} alt = "Logo" style={styles.img}>

                                </Image>
                            ) : (
                                null
                            )}
                    </Text>
                    <TextInput autoCorrect={false} autoCapitalize="none" keyboardType="email-address" placeholder="Completează email" style={styles.inputControl} value={form.email} onChangeText={email => handleEmail(email)}></TextInput>
                    {firstemail == true ? null : emailVerify ? (
                        null
                    ) : (
                        <Text style={{color:"red",marginTop:3}}>
                            Email-ul nu are formatul corect!
                        </Text>
                     )}
                </View>
                
                <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                        Confirmă adresa de email {emailAgainVerify ? (
                                <Image source={require('../assets/images/accepted.png')} alt = "Logo" style={styles.img}>

                                </Image>
                            ) : (
                                null
                            )}
                    </Text>
                    <TextInput autoCorrect={false} autoCapitalize="none" keyboardType="email-address" placeholder="Reintrodu email" style={styles.inputControl} value={form.emailAgain} onChangeText={emailAgain => handleEmailAgain(emailAgain)}></TextInput>
                    {firstEmailAgain == true? null :emailAgainVerify ? (
                        null
                    ) : (
                        <Text style={{color:"red",marginTop:3}}>
                            Email-urile nu coincid!
                           </Text>
                     )}
                </View>

                <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                        Parolă {passwordVerify == "ok" ? (
                               <Image source={require('../assets/images/accepted.png')} alt = "Logo" style={styles.img}>

                               </Image>
                            ) : (
                                null
                            )}
                    </Text>
                    <TextInput secureTextEntry placeholder="Completează parola" style={styles.inputControl} value={form.password} onChangeText={password => handlePassword(password)}></TextInput>
                    {firstPassword == true? null :passwordVerify == "ok" ? (
                        null
                    ) : (
                        <Text style={{color:"red",marginTop:3}}>
                            {passwordVerify}
                           </Text>
                     )}
                </View>

                <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                        Confirmă parola {passwordAgainVerify ? (
                                <Image source={require('../assets/images/accepted.png')} alt = "Logo" style={styles.img}>

                                </Image>
                            ) : (
                                null
                            )}
                    </Text>
                    <TextInput secureTextEntry placeholder="Confirmă parola" style={styles.inputControl} value={form.passwordAgain} onChangeText={passwordAgain => handlePasswordAgain(passwordAgain)}></TextInput>
                    {firstPasswordAgain == true? null :passwordAgainVerify? (
                        null
                    ) : (
                        <Text style={{color:"red",marginTop:3}}>
                            Parolele nu coincid!
                           </Text>
                     )}
                </View>

                <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                        Nume {numeVerify ? (
                                <Image source={require('../assets/images/accepted.png')} alt = "Logo" style={styles.img}>

                                </Image>
                            ) : (
                                null
                            )}
                    </Text>
                    
                    <TextInput autoCorrect={false}  placeholder="Completează numele" style={styles.inputControl} value={form.nume} onChangeText={nume => handleNume(nume)}></TextInput>
                    {firstNume == true? null :numeVerify ? (
                        null
                    ) : (
                        <Text style={{color:"red",marginTop:3}}>
                            Numele este obligatoriu!
                           </Text>
                     )}

                </View>

                <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                        Prenume {prenumeVerify ? (
                                <Image source={require('../assets/images/accepted.png')} alt = "Logo" style={styles.img}>

                                </Image>
                            ) : (
                                null
                            )}
                    </Text>
                    <TextInput autoCorrect={false}  placeholder="Completează prenumele" style={styles.inputControl} value={form.prenume} onChangeText={prenume => handlePrenume(prenume)}></TextInput>
                    {firstPrenume == true? null :prenumeVerify ? (
                        null
                    ) : (
                        <Text style={{color:"red",marginTop:3}}>
                            Prenumele este obligatoriu!
                        </Text>
                     )}
                </View>
                
                <View style={styles.formAction}>
                    <TouchableOpacity onPress={handleSubmit}>
                        <View style={styles.btn}>
                            <Text style = {styles.btnText}>Creează cont!</Text>
                        </View>
                    </TouchableOpacity>
                    {loading? (
                        <ActivityIndicator style={{alignSelf:"center", marginTop:5}} />
                    ):(
                        null
                    )}
                </View>

            </View>

        </View>
    </ScrollView>
    </SafeAreaView> 
  );
}
const styles = StyleSheet.create({
    img:{
        width:15,
        height:15
    },
    error:{
        marginTop:5
    },
    container:{
        padding:24,
        flex:1,
        marginTop:50
    },
    header:{
        marginVertical:30,
    },
    headerImg:{
        width:80,
        height:80,
        alignSelf: "center"
    },
    title:{
        fontSize:27,
        fontWeight:"700",
        color:"#1e1e1e",
        marginBottom:6,
        textAlign:"center"
    },
    subtitle:{
        fontSize:15,
        fontWeight:"400",
        color:"929292",
        textAlign:"center",
        marginBottom:30
    },
    input:{
        marginBottom:16
    },
    inputLabel:{
        fontSize:17,
        fontWeight:"600",
        color:"#222",
        marginBottom:6
    },
    inputControl:{
        height:44,
        backgroundColor:"#fff",
        paddingVertical:5,
        paddingHorizontal:20,
        borderRadius:12,
        fontWeight:"500",
        color:"#222",
        fontSize:15,
        borderColor:"black",
        borderWidth:1
    },
    formAction:{
        marginVertical:24,
    },
    btn:{
        backgroundColor:"#e30613",
        borderRadius:8,
        borderWidth:1,
        borderColor:"#e30613",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        paddingVertical:10,
        paddingHorizontal:20, 
    },
    btnText:{
        fontSize:18,
        fontWeight:"600",
        color:"#fff"
    },
    formFooter:{
        fontSize:15,
        fontWeight:"600",
        color:"#222",
        textAlign:"center",
    }
})
