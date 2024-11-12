import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { useUserDatabase, UserDatabase } from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';

const History = () => {
    const router = useRouter();
    const [historyItems, setHistoryItems] = useState<UserDatabase[]>([]);
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
        const fetchHistory = async () => {
            //const response = await UserDatabase.getHistory();
            setHistoryItems([]);
        };

        fetchHistory();
    }, []);

    const renderHistoryItem = ({ item }: { item: UserDatabase }) => (
        <TouchableOpacity style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDate}>{item.use}</Text>
            <Text style={styles.itemPrice}>R$ {item.use.toFixed(2)}</Text>
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
                data={historyItems}
                keyExtractor={(item) => String(item.use)}
                renderItem={renderHistoryItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.nce}>
                        <Text style={styles.emptyMessage}>Nenhum histórico encontrado</Text>
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
    itemDate: {
        fontSize: 14,
        color: '#666',
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

export default History;
