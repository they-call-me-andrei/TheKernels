import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IP } from "@/data/ip";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Cont({route}) {
    const { idUtilizator} = route.params;

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showRewards, setShowRewards] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
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

    const rewards = [
        { id: '1', name: 'FIFA Points', image: require('../assets/images/fifapoints.png'), cost: 150 },
        { id: '2', name: 'Voucher Restaurant', image: require('../assets/images/restaurantimg.png'), cost: 100 },
        { id: '3', name: 'Bani în PayPal', image: require('../assets/images/paypal.png'), cost: 200 },
        { id: '4', name: 'Voucher eMAG', image: require('../assets/images/emag.jpg'), cost: 250 },
    ];

    const handleRewardPress = (reward) => {
        setSelectedReward(reward);
        setModalVisible(true);
    };

    const handleRedeem = async () => {
        const totalCost = selectedReward.cost * quantity;
        if (totalCost > data.numarCredite) {
            alert('Nu aveți suficiente credite.');
        } else {
            await axios.put(`http://${IP}:5555/livrator/credite-minus/${idUtilizator}`,{
                payload: totalCost
            });
            await fetchData();
            // Aici puteți adăuga logica pentru a scădea creditele și a procesa revendicarea
            alert(`Ați revendicat ${quantity} ${selectedReward.name} pentru ${totalCost} credite.`);
        }
        setModalVisible(false);
    };
  
    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#f5f5f5"}}>
            <ScrollView style={styles.container}>
                {loading == false ? (
                    <>
                        <View style={styles.creditsContainer}>
                            <Icon name="star" size={30} color="gold" />
                            <Text style={styles.creditsText}>{data.numarCredite} Credite EcoByte</Text>
                            <Icon name="star" size={30} color="gold" />
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>Setările Contului</Text>
                            <View style={styles.detailContainer}>
                                <Icon name="person" size={20} color="purple" />
                                <Text style={styles.text}><Text style={styles.label}>ID: </Text>{data._id}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="email" size={20} color="purple" />
                                <Text style={styles.text}><Text style={styles.label}>Email: </Text>{data.email}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="lock" size={20} color="purple" />
                                <Text style={styles.text}><Text style={styles.label}>Parola: </Text>{data.password}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="badge" size={20} color="purple" />
                                <Text style={styles.text}><Text style={styles.label}>Nume: </Text>{data.nume}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="badge" size={20} color="purple" />
                                <Text style={styles.text}><Text style={styles.label}>Prenume: </Text>{data.prenume}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => setShowRewards(!showRewards)}>
                            <Icon name="redeem" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Revendică Premiile</Text>
                        </TouchableOpacity>
                        {showRewards && (
                            <View style={styles.rewardsContainer}>
                                {rewards.map(reward => (
                                    <TouchableOpacity key={reward.id} style={styles.rewardCard} onPress={() => handleRewardPress(reward)}>
                                        <Image source={reward.image} style={styles.rewardImage} />
                                        <Text style={styles.rewardText}>{reward.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
            </ScrollView>
            {selectedReward && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Selectați Cantitatea</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Cantitate"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                            />
                            <Text style={styles.modalText}>Cost total: {selectedReward.cost * quantity} Credite</Text>
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
        color: 'purple',
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
        color: 'purple',
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
        color: 'gold',
        marginHorizontal: 10,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
    rewardsContainer: {
        marginTop: 20,
    },
    rewardCard: {
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
    rewardImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    rewardText: {
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