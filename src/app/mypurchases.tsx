import React, { useEffect, useState } from 'react';
import { useRouter,useLocalSearchParams  } from 'expo-router';
import { SafeAreaView, StyleSheet, FlatList, Alert, Text, Image,TouchableOpacity, View } from 'react-native';
import { useUserDatabase, UserDatabase } from '@/database/useUserDatabase'; // Supondo que você tenha esta função
import {url} from '@/app/login';


const MyPurchases = () => {
    const router = useRouter();
    const { tokey } = useLocalSearchParams();
    const [compras, setCompras] = useState<UserDatabase[]>([]);
    const UserDatabase = useUserDatabase(); 


    const handleRegister = async () => {
    try {
        const response = await fetch(url+'mcompras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokey}),
        });
        const data = await response.json();
        if (response.ok) {
            console.log('')
        } else {
            console.log(data.message)
        }

    } catch (error) {
        Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
};
    useEffect(() => {
        const fetchCompras = async () => {
            handleRegister()//const response =  UserDatabase.getCompras(); // Suponha que você tenha uma função que busque as compras
             setCompras([]);
        };

        fetchCompras();
    }, []);

    const renderCompraItem = ({ item }: { item: UserDatabase }) => (
        <TouchableOpacity style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>R$ {item.id.toFixed(2)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topbox}>
                <View style={styles.iconbox}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Image style={styles.image} source={require('../assets/4.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={compras}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCompraItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<View style={styles.nce}><Text style={styles.emptyMessage}>Nenhuma compra encontrada</Text></View>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topbox:{
      height:100,
      flexDirection:'column-reverse',
      backgroundColor: '#10d010',
    },
    iconbox:{
      height:50,
      justifyContent:'space-between',
      flexDirection:'row',
    },
    image:{
      margin:10,
      width:30,
      height:30,
    },
    listContainer: {
        flexGrow: 1,
    },
    itemContainer: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: '#0f0',
    },
    emptyMessage: {
        fontSize:40,
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    nce:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    },
});

export default MyPurchases;
