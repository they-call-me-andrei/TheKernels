import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IP } from "@/data/ip";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Cont({route}) {
    const { idUtilizator } = route.params;

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showOffers, setShowOffers] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const response = await axios.get(
            `http://${IP}:5555/utilizator/${idUtilizator}`
        );
        setLoading(false);
        setData(response.data);
    }

    const offers = [
        { id: '1', name: 'Gusturi romanesti | Salam de biscuiti cu rahat si stafide', image: require('../assets/images/salambiscuiti.png'), cost: 20, description: 'Salam de biscuiti cu rahat si stafide, un desert traditional romanesc.' },
        { id: '2', name: 'Reducere 20% la produsele mega', image: require('../assets/images/mega_image_logo.png'), cost: 100, description: 'Reducere de 20% la toate produsele din magazinul Mega Image.' },
        { id: '3', name: 'Baton Snickers', image: require('../assets/images/snickers.jpg'), cost: 200, description: 'Baton de ciocolata Snickers, perfect pentru o gustare rapida.' },
        { id: '4', name: '-41% Gusturi romanesti | Carcasa de curcan', image: require('../assets/images/curcan.png'), cost: 0, description: 'Reducere aplicata pentru toti clientii cu card connect.' },
    ];

    const handleOfferPress = (offer) => {
        setSelectedOffer(offer);
        setModalVisible(true);
    };

    const handleRedeem = async () => {
        const totalCost = selectedOffer.cost * quantity;
        if (totalCost > data.numarCredite) {
            alert('Nu aveți suficiente puncte de loialitate.');
        } else {
            await axios.put(`http://${IP}:5555/utilizator/credite-minus/${idUtilizator}`,{
                payload: totalCost
            });
            await fetchData();
            alert(`Ați revendicat ${quantity} ${selectedOffer.name} pentru ${totalCost} puncte de loialitate.`);
        }
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#f5f5f5"}}>
            <ScrollView style={styles.container}>
                {loading == false ? (
                    <>
                        <View style={styles.creditsContainer}>
                            <Icon name="loyalty" size={30} color="red" />
                            <Text style={styles.creditsText}>{data.numarCredite} Puncte de Loialitate</Text>
                            <Icon name="loyalty" size={30} color="red" />
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>Setările Contului</Text>
                            <View style={styles.detailContainer}>
                                <Icon name="email" size={20} color="red" />
                                <Text style={styles.text}><Text style={styles.label}>Email: </Text>{data.email}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="lock" size={20} color="red" />
                                <Text style={styles.text}><Text style={styles.label}>Parola: </Text>{data.password}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="badge" size={20} color="red" />
                                <Text style={styles.text}><Text style={styles.label}>Nume: </Text>{data.nume}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="badge" size={20} color="red" />
                                <Text style={styles.text}><Text style={styles.label}>Prenume: </Text>{data.prenume}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => setShowOffers(!showOffers)}>
                            <Icon name="local-offer" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Vezi Ofertele Exclusive</Text>
                        </TouchableOpacity>
                        {showOffers && (
                            <View style={styles.offersContainer}>
                                {offers.map(offer => (
                                    <TouchableOpacity key={offer.id} style={styles.offerCard} onPress={() => handleOfferPress(offer)}>
                                        <Image source={offer.image} style={styles.offerImage} />
                                        <Text style={styles.offerText}>{offer.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
            </ScrollView>
            {selectedOffer && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedOffer.name}</Text>
                            <Text style={styles.modalDescription}>{selectedOffer.description}</Text>
                            {selectedOffer.id === '4' ? (
                                <Text style={styles.modalSpecial}>Reducere aplicata pentru toti clientii cu card connect.</Text>
                            ) : (
                                <Text style={styles.modalText}>Cost total: {selectedOffer.cost * quantity} Puncte de Loialitate</Text>
                            )}
                            <TextInput
                                style={styles.input}
                                placeholder="Cantitate"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.button} onPress={handleRedeem}>
                                <Text style={styles.buttonText}>Revendică</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    label: {
        fontWeight: 'bold',
        color: 'red',
    },
    creditsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    creditsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
        marginHorizontal: 10,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
    offersContainer: {
        marginTop: 20,
    },
    offerCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignItems: 'center',
    },
    offerImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    offerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSpecial: {
        fontSize: 16,
        marginBottom: 20,
        color: 'red',
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
});