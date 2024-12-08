import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { IP } from '@/data/ip';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { router } from 'expo-router';

export default function Payment() {
  const { idUtilizator, gramajTotal } = useLocalSearchParams<{ idUtilizator: string, gramajTotal: number }>();

  const [pretTotal, setPretTotal] = useState(0);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    cvv: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchPretTotal();
  }, []);

  const fetchPretTotal = async () => {
    try {
      const response = await axios.get(`http://${IP}:5555/utilizator/${idUtilizator}`);
      setPretTotal(response.data.cosCurent.pretTotal);
    } catch (error) {
      console.error('Error fetching pretTotal:', error);
    }
  };

  const makePayment = async () => {
    try {
      await axios.delete(`http://${IP}:5555/complete-payment/${idUtilizator}`);
    } catch (error) {
      console.error('Error fetching pretTotal:', error);
    }
  };

  const handlePayment = (method) => {
    if (method === 'cash') {
      makePayment();
      setShowCashModal(true);
    } else if (method === 'card') {
      setShowCardModal(true);
    }
  };

  const handleCardPayment = () => {
    makePayment();
    setShowCardModal(false);
    setShowQrModal(true);
  };

  function handleClose(){
    setShowCashModal(false);
    router.push({
      pathname:"/mainpage",
      params: {
          idUtilizator: idUtilizator
      }
  });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Alege metoda de plată</Text>
        <Text style={styles.totalText}>Preț Total: {pretTotal.toFixed(2)} RON</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handlePayment('cash')}>
            <Text style={styles.buttonText}>Plată Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePayment('card')}>
            <Text style={styles.buttonText}>Plată cu Cardul</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showCashModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Prezentati urmatorul cod QR casierei</Text>
          <QRCode
            value={pretTotal.toString()}
            size={200}
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => {handleClose()}}>
            <Text style={styles.modalButtonText}>Închide</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showCardModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Plată cu Cardul</Text>
          <Text style={styles.modalText}>Preț Total: {pretTotal.toFixed(2)} RON</Text>
          <TextInput
            style={styles.input}
            placeholder="Numărul Cardului"
            value={cardDetails.cardNumber}
            onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Numele Titularului"
            value={cardDetails.cardHolderName}
            onChangeText={(text) => setCardDetails({ ...cardDetails, cardHolderName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={cardDetails.cvv}
            onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
            keyboardType="numeric"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Data Expirării (MM/YY)"
            value={cardDetails.expiryDate}
            onChangeText={(text) => setCardDetails({ ...cardDetails, expiryDate: text })}
          />
          <TouchableOpacity style={styles.modalButton2} onPress={handleCardPayment}>
            <Text style={styles.modalButtonText}>Confirmă Plata</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton2} onPress={() => setShowCardModal(false)}>
            <Text style={styles.modalButtonText}>Anulează</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showQrModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Asezati cosul de cumparaturi pe cantarul de verificare si apropiati acest cod QR de cititor</Text>
          <QRCode
            value={gramajTotal.toString()}
            size={200}
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => handleClose()}>
            <Text style={styles.modalButtonText}>Închide</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalButton2: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});