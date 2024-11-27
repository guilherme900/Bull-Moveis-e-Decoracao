import {Link,router} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,Alert,ScrollView,Pressable ,PressableProps,Text,Image,TouchableOpacity,Modal,BackHandler,FlatList} from 'react-native';
import { Button, Card } from 'react-native-paper';
import {useUserDatabase,UserDatabase} from '@/database/useUserDatabase';
import {Rconta} from '@/components/rcontas';
import {readConfigFile} from '@/app/login';
import {Ordens} from '@/app/indexv';

export default function Index(){

  const UserDatabase = useUserDatabase()
  const [tokey,setTokey] = useState<string>('')
  const [ordens,setOrdens] = useState<Ordens[]>([]); 
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
    fetchConfigUrl()
    fetchUserTokey()
  },[]);

  useEffect(() => {
    if(url&&tokey){getordens()}
  },[url,tokey]);

  

  const fetchConfigUrl = async () => {
    const configUrl = await readConfigFile();
    setUrl(configUrl);
  };

  const fetchUserTokey = async () => {
    const response = await UserDatabase.serchByuse(1);
    if (response && response.length > 0) {
      setTokey(response[0].tokey) 
    }
  };

  const handleProdutoPress = (produto:Ordens) => {
    const id = produto.id_pro
    router.push({
        pathname: '/produto',
        params: { chave:id,vend:'s'},
    });
  };  

  const getordens = async()=>{
    try {
      const formData = { tokey };
  
      const uploadResponse = await fetch(url + 'getordense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const json: Ordens[] = await uploadResponse.json();
  
      if (uploadResponse.ok) {
        if (json && Array.isArray(json) && json.length > 0) {
          setOrdens(json)
        } else {
          console.log('Lista de ordens  vazia!');
        }
      } else {
        console.error('Erro ao obter ordens:', json);
        Alert.alert('Erro', 'Erro ao carregar ordens.');
      }
    } catch (error) {
      console.error('Erro ao conectar ordens:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  }
  return(
    <SafeAreaView>            
            <View style={styles.topbox}>
              <View style={styles.iconbox}>
                  <TouchableOpacity onPress={() => router.push('/')}>
                      <Image style={styles.image} source={require('../assets/4.png')} />
                  </TouchableOpacity>
              </View>
            </View>
            <View style={stylesp.produtosContainer}>
              {ordens.length === 0 ? (
                <Text style={stylesp.noProductText}>Nenhum venda encontrado.</Text>
              ) : (
                <ScrollView style={{width:330}}>
                {ordens.map((ordem, index) => (
                  <View key={index} style={stylesp.produtoCard}>
                    <Text style={stylesp.produtoName}>produto:{ordem.name_pro}</Text>
                    <TouchableOpacity onPress={() => handleProdutoPress(ordem)}>
                     <View style={stylesp.produtoImageContainer}>
                     <Text style={stylesp.produtbutontext}>Detalhes do produto</Text>
                     </View>
                    </TouchableOpacity>
                    <Text style={{fontSize:18}}>enviar para:</Text>
                    <Text style={stylesp.produtoName}>{ordem.name_cli}</Text>
                    <Text style={stylesp.produtoName}>{ordem.email_cli}</Text><Text/>
                    <Text style={{fontSize:18}}>cep:{ordem.cep_end}</Text>
                    <Text style={{fontSize:18}}>endereço:</Text>
                    <Text style={{fontSize:18}}> {ordem.uf_end},{ordem.cidade},{ordem.rua},{ordem.numero}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
            </View>
    </SafeAreaView>
)}

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
  },
  botonNp:{
    borderRadius:30,
    backgroundColor:'#eee',
    justifyContent:'center',
    alignItems:'center',
    height:48,
    width:160
  }
});

const stylesp = StyleSheet.create({
  produtosContainer: {
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
    height: 50,
    borderRadius:15,
    backgroundColor:'#afa',
    alignItems:'center',
    justifyContent:'center',
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
  produtbutontext: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#0a0',
    marginBottom: 5,
  },
});