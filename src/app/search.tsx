import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View, Image,Alert, TextInput, Keyboard, FlatList, TouchableOpacity, Text } from 'react-native';
import { useUserDatabase, UserDatabase } from '@/database/useUserDatabase';
import {Endereco} from '@/app/indexv';
import {readConfigFile} from '@/app/login';
import { Produto } from '@/app/myProducts';

const ender ={cep:'',uf:'',cidade:'',rua:'',numero:0,}
const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Produto[]>([]);
    const [endereco,setEndereco] = useState<Endereco>(ender); 
    const inputRef = useRef<TextInput>(null);
    const [tokey, setTokey] = useState<string>('');
    const router = useRouter();
    const UserDatabase = useUserDatabase();
    const [url, setUrl] = useState<string>('');
    
    useEffect(() => {
        const fetchConfigUrl = async () => {
          const configUrl = await readConfigFile();
          setUrl(configUrl);
        };
        fetchConfigUrl();
        fetchUserTokey()
      },[]);

    useEffect(() => {
    if(url&&tokey){getendereco()}
    },[url,tokey]);

    useEffect(() => {
        if(url&&tokey){fetchResults()}
    }, [searchQuery]);

    useEffect(() => {
        const abrirTeclado = () => {
            if (inputRef.current) {
                inputRef.current.focus();
                Keyboard.addListener('keyboardDidShow', () => {
                });
            }
        };

        const timeout = setTimeout(abrirTeclado, 100);

        return () => clearTimeout(timeout);
    }, []);
    
    const fetchUserTokey = async () => {
        const response = await UserDatabase.serchByuse(1);
        if (response && response.length > 0) {
          setTokey(response[0].tokey) 
        }
    };
    const getendereco = async ()=>{
        try {
          const formData = { tokey };
      
          const uploadResponse = await fetch(url + 'getendereco', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const json: Endereco = await uploadResponse.json() ;
      
          if (uploadResponse.ok) {
            if (json && json.cidade !== "Nenhum endereço encontrado") {
              setEndereco(json);
            } else {
              console.log('sem endereco');
            }
          } else {
            console.error('Erro ao obter endereço:', json);
          }
        } catch (error) {
          console.error('Erro ao conectar endereço:', error);
        }
      }
    const fetchResults = async () => {
        try {
            let formData 
            if(endereco.cep){
                const cep = endereco.cep
                formData = { cep,searchQuery}
            }else{
                const cep = '14460000'
                formData = { cep,searchQuery}
            }
      
          const uploadResponse = await fetch(url + 'getproductscliente', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const json: Produto[] = await uploadResponse.json();
          
          if (uploadResponse.ok) {
            
            setResults(json);
          } else {
            console.error('Erro ao obter produtos:', json);
            Alert.alert('Erro', 'Erro ao carregar produtos.');
          }
        } catch (error) {
          console.error('Erro ao conectar ao servidor:', error);
          Alert.alert('Erro', 'Erro ao conectar ao servidor.');
        }
      };
    const handleSelectResult = (item: Produto) => {
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
                keyExtractor={(item) => String(item.id)}
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
