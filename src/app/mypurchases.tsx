import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet,ScrollView, View, Image,Alert, TextInput, TouchableOpacity, Text } from 'react-native';
import { useUserDatabase } from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import { Produto } from '@/app/myProducts';
export type Response={
    valor:number;
    data:string;
    id_produto:number;
    nome_produto:string;
    image:string;
}
const SearchScreen = () => {
    const [results, setResults] = useState<Response[]>([]);
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
    if(url&&tokey){fetchcompras()}
    },[url,tokey]);

    const fetchUserTokey = async () => {
        const response = await UserDatabase.serchByuse(1);
        if (response && response.length > 0) {
          setTokey(response[0].tokey) 
        }
    };

    const fetchcompras = async () => {
        try {
            const formData = {tokey}
      
          const uploadResponse = await fetch(url + 'mcompras', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const json: Response[] = await uploadResponse.json();
          
          if (uploadResponse.ok) {
            if (json && Array.isArray(json) && json.length > 0) {
                setResults(json)
              } else { 
                console.log('err:',json);
              }
          } else {
            console.error('Erro ao obter produtos:', json);
            Alert.alert('Erro', 'Erro ao carregar produtos.');
          }
        } catch (error) {
          console.error('Erro ao conectar ao servidor:', error);
          Alert.alert('Erro', 'Erro ao conectar ao servidor.');
        }
    };

    const Conteudo = () => {
      const handleProdutoPress = (produto:Response) => {
        const id = produto.id_produto
        router.push({
            pathname: '/produto',
            params: { chave:id},
        });
      };  
      
    
      return (
        <View style={{ flex: 1 }}>
          <View style={{marginVertical: 30,alignItems:'center'}}>
          </View>  
          <View style={stylesp.produtosContainer}>
            {results.length === 0 ? (
              <Text style={stylesp.noProductText}>Nenhum produto encontrado.</Text>
            ) : (
              <ScrollView style={{width:330}}>
              {results.map((produto, index) => (
                <View key={index} style={stylesp.produtoCard}>
                  <TouchableOpacity onPress={() => handleProdutoPress(produto)} style={stylesp.produtoImageContainer}>
                    <Image source={{ uri: produto.image }} style={stylesp.produtoImage} />
                  </TouchableOpacity>
                  <Text style={stylesp.produtoName}>{produto.nome_produto}</Text>
                  <Text style={stylesp.produtoValue}>Preço: R${produto.valor.toFixed(2)}</Text>
                  
                </View>
              ))}
            </ScrollView>
          )}
          </View>
        </View>
      );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topbox}>
                <View style={styles.iconbox}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Image style={styles.image} source={require('../assets/4.png')} />
                </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
              <Conteudo/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
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
  lupa:{
    width:20,
    height:20,
    margin:10,
  },
  textbox:{
    margin:5,
    height:40,
    width:270,
    borderRadius:20,
    flexDirection:'row',
    backgroundColor : '#ffffff',
  },
  option:{
    flex:1,
    flexDirection:'row',
  },
  optionbox:{
    width:'60%',
    height:'100%',
    backgroundColor:'#eee',
  },
  prefilbox:{
    height:100,
    flexDirection:'column-reverse',
  },
  perfil:{
    height:60,
    flexDirection:'row',
  },
  iconperfil:{
    height:60,
    width:60,
    borderRadius:50,
    backgroundColor: '#ffff00',
  },
  nameperfil:{
    margin:5,
    height:40,
    width:120,
    alignItems:'center',
    borderRadius:20,
    flexDirection:'row',

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

  card:{
    marginTop:20,
    backgroundColor: '#eeeeee'
  },
  box:{
    elevation: 9,
    margin:20,
    borderRadius:40,
    width:300,
    height:280,
    alignItems:'center',
    backgroundColor: '#fff'
  },
  boximage:{
    margin:10,
    width:210,
    height:180,
    },
  boxtext:{
    fontSize:17
  },
  textvalor:{
    fontSize:16,
    color:'#0f0'
  },
  imageproduto:{
    margin:10,
    width:400,
    height:400,

  },
  search:{
    flex:1,
    backgroundColor:'#fff',
  },
  searchbox:{
    width:'100%',
    height:60,
  },
  cart:{
    flex:1,
    backgroundColor:'#fff',
  },
  botonNC:{
    backgroundColor: '#dfd',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#10d010',
    borderWidth:3,
    borderRadius: 5,
    gap:12,
    flexDirection:"row"
  }
});
const stylesp = StyleSheet.create({
  produtosContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  noProductText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  produtoCard: {
    width: 300,
    height:350,
    alignItems:'center',
    marginVertical: 10,
    marginHorizontal:20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  produtoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  produtoDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  produtoQuantity: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  produtoValue: {
    fontSize: 16,
    color: '#0f0',
    marginBottom: 10,
  },
  produtoImageContainer: {
    width: 250,
    height: 250,
    marginTop: 10,
  },
  produtoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeModalButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ff4c4c',
    borderRadius: 10,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalProductDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  modalProductPrice: {
    fontSize: 18,
    color: '#0c0',
    marginBottom: 20,
  },
  modalImagesContainer: {
    marginBottom: 20,
  },
  modalProductImage: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  addToCartButton: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#0f0',
    borderRadius: 20,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 18,
    color: '#fff',
  },
  buyButton: {
    padding: 15,
    backgroundColor: '#0a74da',
    borderRadius: 20,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default SearchScreen;
