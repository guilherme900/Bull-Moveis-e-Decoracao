import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View, Image, TextInput, Keyboard, FlatList, TouchableOpacity, Text } from 'react-native';
import { useUserDatabase, UserDatabase } from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<UserDatabase[]>([]);
    const inputRef = useRef<TextInput>(null);
    const router = useRouter();
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
        const fetchResults = async () => {
            setResults([]);
            // Aqui você pode adicionar a lógica para buscar resultados com base em `searchQuery`
        };

        fetchResults();
    }, [searchQuery]);

    useEffect(() => {
        const abrirTeclado = () => {
            if (inputRef.current) {
                inputRef.current.focus();
                Keyboard.addListener('keyboardDidShow', () => {
                    // O teclado foi mostrado
                });
            }
        };

        const timeout = setTimeout(abrirTeclado, 100);

        return () => clearTimeout(timeout);
    }, []);

    const handleSelectResult = (item: UserDatabase) => {
        console.log('Selected item:', item);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topbox}>
                <View style={styles.iconbox}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Image style={styles.image} source={require('../assets/4.png')} />
                    </TouchableOpacity>
                    <View style={{ width: 290 }}>
                        <TextInput
                            ref={inputRef}
                            enablesReturnKeyAutomatically={true}
                            style={styles.searchInput}
                            placeholder="Pesquisar..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <View style={styles.image}/>
                </View>
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => String(item.use)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectResult(item)}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultsContainer}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No results found</Text>}
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
    searchInput: {
        height: 45,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    resultsContainer: {
        flexGrow: 1,
    },
    resultItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
});

export default SearchScreen;
