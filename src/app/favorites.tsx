import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { useUserDatabase, UserDatabase } from '@/database/useUserDatabase'; // Ensure this path is correct

const Favorites = () => {
    const router = useRouter();
    const [favorites, setFavorites] = useState<UserDatabase[]>([]);
    const UserDatabase = useUserDatabase();

    useEffect(() => {
        const fetchFavorites = async () => {
            //const response = await UserDatabase.getFavorites(); // Assume this function fetches favorite items
            setFavorites([]);
        };

        fetchFavorites();
    }, []);


    const renderFavoriteItem = ({ item }: { item: UserDatabase }) => (
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
                data={favorites}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderFavoriteItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.nce}>
                        <Text style={styles.emptyMessage}>Nenhum favorite encontrado</Text>
                    </View>
                }
            />
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
});

export default Favorites;
