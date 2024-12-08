import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Platform, ToastAndroid, Image, Modal } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import axios from 'axios';
import { IP } from '@/data/ip';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { router } from 'expo-router';

// Pre-step, call this before any NFC operations
NfcManager.start();

export default function Cosulmeu({ route }) {
  const { idUtilizator } = route.params;

  const [showNfcPrompt, setShowNfcPrompt] = useState(false);
  const [produse, setProduse] = useState([]);
  const [pretTotal, setPretTotal] = useState(0);
  const [gramajTotal, setGramajTotal] = useState(0);
  const [showQrScanner, setShowQrScanner] = useState(false);

  useEffect(() => {
    fetchPachete();
  }, []);

  const handleNfcScan = async () => {
    setShowNfcPrompt(true);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Apropie telefonul de produs', ToastAndroid.LONG);
    } else {
      Alert.alert('Scanează Tag NFC', 'Apropie telefonul de tagul NFC', [{ text: 'OK' }], { cancelable: true });
    }
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag && tag.ndefMessage) {
        const ndefRecords = tag.ndefMessage;
        const text = Ndef.text.decodePayload(ndefRecords[0].payload);
        await addProductToCart(text);
        await fetchPachete();
        console.log(text);
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setShowNfcPrompt(false);
    }
  };

  const handleQrScan = async (e) => {
    const data = e.data.split(',');
    const idProdus = data[0];
    const gramaj = data[1];
    const price = data[2];
    console.log(`ID Produs: ${idProdus}, Gramaj: ${gramaj}, Price: ${price}`);
    setShowQrScanner(false);  
    const produs = await axios.get(`http://${IP}:5555/produse/${idProdus}`)
    const response = await axios.post(`http://${IP}:5555/produse/adauga-produse`,{
      "nume": produs.data.nume,
      "pret":price,
      "descriere":"",
      "poza":produs.data.poza,
      "gramaj":gramaj,
      "tip":"double"
    })
    await addProductToCart(response.data._id);
  };


  const addProductToCart = async (id) => {
    try {
      await axios.put(`http://${IP}:5555/coscurent/${idUtilizator}/add/${id}`);
      await fetchPachete();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const removeProductFromCart = async (id) => {
    try {
      await axios.delete(`http://${IP}:5555/coscurent/${idUtilizator}/remove/${id}`);
      await fetchPachete();
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const fetchPachete = async () => {
    try {
      const userResponse = await axios.get(`http://${IP}:5555/utilizator/${idUtilizator}`);
      const items = userResponse.data.cosCurent.items;
      const total = userResponse.data.cosCurent.pretTotal;

      const productDetailsPromises = items.map(idProdus => 
        axios.get(`http://${IP}:5555/produse/${idProdus}`)
      );

      const productDetailsResponses = await Promise.all(productDetailsPromises);
      const productDetails = productDetailsResponses.map(response => response.data);

      // Gruparea produselor după ID și calcularea cantității
      const groupedProducts = productDetails.reduce((acc, product) => {
        const existingProduct = acc.find(p => p._id === product._id);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          acc.push({ ...product, quantity: 1 });
        }
        return acc;
      }, []);

      const gramajTotal = groupedProducts.reduce((acc, product) => acc + (product.tip == "double" ? product.gramaj * product.quantity * 1000 : product.gramaj * product.quantity), 0);

      setProduse(groupedProducts);
      setPretTotal(total);
      setGramajTotal(gramajTotal);
    } catch (error) {
      console.error('Error fetching pachete:', error);
    }
  };

  const images = [ { image: require("../assets/images/telemea_de_vaca.png"), name: "Hochland Telemea de Vaca" },
    { image: require("../assets/images/kinder_felie_de_lapte.png"),
    name: "Kinder Felie De Lapte" },
    { image: require("../assets/images/kiwi.jpg"),
    name: "Kiwi" },
    { image: require("../assets/images/ananas.jpg"),
      name: "Ananas" },
      { image: require("../assets/images/pere.jpg"),
        name: "Pere" },
        { image: require("../assets/images/pepene_rosu.jpg"),
          name: "Pepene Rosu" },
          { image: require("../assets/images/pepene_galben.jpg"),
            name: "Pepene Galben" },
            { image: require("../assets/images/struguri.jpg"),
              name: "Struguri" },
              { image: require("../assets/images/portocala.jpg"),
                name: "Portocale" },
                { image: require("../assets/images/banana.jpg"),
                  name: "Banane" },
  
                  { image: require("../assets/images/mar.jpg"),
                    name: "Mere" },
  
                    { image: require("../assets/images/morcov.jpg"),
                      name: "Morcovi" },
  
                      { image: require("../assets/images/cartof.jpg"),
                        name: "Cartofi" },
  
                        { image: require("../assets/images/broccoli.jpg"),
                          name: "Broccoli" },
  
                          { image: require("../assets/images/ceapa.jpg"),
                            name: "Ceapa" },
  
                            { image: require("../assets/images/vinete.jpg"),
                              name: "Vinete" },
  
                              { image: require("../assets/images/castraveti.jpg"),
                                name: "Castraveti" },
                                { image: require("../assets/images/rosii.jpg"),
                                  name: "Rosii" },
                                  { image: require("../assets/images/ardei_gras.jpg"),
                                    name: "Ardei Gras" },    
  
   ]; 

   /*
   <View style={styles.totalContainer}>
          <Icon name="scale" size={24} color="#FF0000" />
          <Text style={styles.totalText}>Gramaj Total: {gramajTotal} g</Text>
        </View>
   */

    const handleNavigate = () => {
      router.push({
        pathname:"/payment",
        params: {
            idUtilizator: idUtilizator,
            gramajTotal: gramajTotal
        }
    });
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={styles.container}>
      {pretTotal > 0 && (
      <TouchableOpacity style={styles.totalContainer} onPress={handleNavigate}>
          <Icon name="shopping-cart" size={24} color="white" />
          <Text style={styles.totalText}>Către Plată: {pretTotal.toFixed(2)} RON</Text>
      </TouchableOpacity>)}
                {produse.length > 0 ? (
          <>
                        {produse.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Image source={images.find(itemm => itemm.name === item.nume)?.image} style={styles.image} resizeMode="contain" />
                <View style={styles.detailsContainer}>
                  <Text style={styles.name}>{item.nume}</Text>
                  <Text style={styles.text}>
                    {item.pret.toFixed(2)} RON {item.tip === "cantaribil" && <Text>per kg</Text>}
                  </Text>
                  <Text style={styles.text}>{item.tip === "double" ? <Text>{item.gramaj * 1000} g</Text> : <Text>{item.gramaj} g</Text>}</Text>
                  <View style={styles.buttonGroup}>
                      {item.tip === "double" ? (
                          <TouchableOpacity style={styles.quantityButton} onPress={() => removeProductFromCart(item._id)}>
                            <Icon name="delete" size={24} color="#fff" />
                            <Text style={{color:"white", marginLeft:8, marginEnd:3}}>Elimină</Text>
                          </TouchableOpacity>
                      ):(
                        <TouchableOpacity style={styles.quantityButton} onPress={() => removeProductFromCart(item._id)}>
                          <Icon name="remove" size={24} color="#fff" />
                        </TouchableOpacity>
                      )}
                      <></>
                    {item.tip !== "cantaribil" && item.tip !== "double" && (
                      <>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={() => addProductToCart(item._id)}>
                          <Icon name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.title}>Nu există niciun produs în coș.</Text>
        )}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.scanButton} onPress={handleNfcScan}>
          <Icon name="nfc" size={24} color="#fff" />
          <Text style={styles.buttonText}>NFC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} onPress={() => setShowQrScanner(true)}>
          <Icon name="qr-code-scanner" size={24} color="#fff" />
          <Text style={styles.buttonText}>QR</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showQrScanner} animationType="slide">
        <QRCodeScanner
          onRead={handleQrScan}
          topContent={<Text style={styles.centerText}>Scanează codul QR</Text>}
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable} onPress={() => setShowQrScanner(false)}>
              <Text style={{color: '#fff',fontSize: 16,}}>Anulează</Text>
            </TouchableOpacity>
          }
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "white"
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  scanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    marginHorizontal: 15,
    marginBottom: 15,
    borderWidth: 0,
    marginTop:10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  nfcPrompt: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
  errorMessage: {
    color: 'red',
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    marginHorizontal: 20,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 10,
  },
  image: {
    width: 115,
    height: 115,
    borderRadius: 10,
    alignSelf: 'center',
    marginRight: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#59CE8F',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    marginHorizontal: 20,
    marginTop:20
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  buttonTouchable: {
    padding: 16,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    marginTop: 50,
  },
});