import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity, View, Image, Button } from 'react-native';
import { useUserDatabase, UserDatabase } from '@/database/useUserDatabase'; // Ensure this path is correct
import {readConfigFile} from '@/app/login';

const Cart = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<UserDatabase[]>([]);
    const UserDatabase = useUserDatabase();
    const [url, setUrl] = useState<string>('');
    
    useEffect(() => {
        const fetchConfigUrl = async () => {
          const configUrl = await readConfigFile();
          setUrl(configUrl);
        };
        fetchConfigUrl();
      },[]);

    useEffect(() => {
        const fetchCartItems = async () => {
            //const response = await UserDatabase.getCartItems(); // Assume this function fetches cart items
            setCartItems([]);
        };

        fetchCartItems();
    }, []);

    const handleCheckout = () => {
        // Implement checkout logic here
        alert('Proceeding to checkout');
    };

    const renderCartItem = ({ item }: { item: UserDatabase }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>R$ {item.use.toFixed(2)}</Text>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                    // Logic to remove item from cart
                    //UserDatabase.removeItemFromCart(item.use);
                    setCartItems(cartItems.filter(i => i.use !== item.use));
                }}
            >
                <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
        </View>
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
                data={cartItems}
                keyExtractor={(item) => String(item.use)}
                renderItem={renderCartItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.nce}>
                        <Text style={styles.emptyMessage}>Seu carrinho está vazio</Text>
                    </View>
                }
            />
            {cartItems.length > 0 && (
                <Button title="Finalizar Compra" onPress={handleCheckout} />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topbox: {
        height: 100,
        flexDirection: 'column-reverse',
        backgroundColor: '#10d010',
    },
    iconbox: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    image: {
        margin: 10,
        width: 30,
        height: 30,
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
        fontSize: 40,
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    nce: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ff4d4d',
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default Cart;
