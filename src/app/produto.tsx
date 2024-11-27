import {useGlobalSearchParams,router} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,Alert,ScrollView,Text,Image,TouchableOpacity} from 'react-native';
import {useUserDatabase} from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import { Produto } from '@/app/myProducts';

export default function produto (){
    const UserDatabase = useUserDatabase()
    const [selectedProduto, setSelectedProduto] = useState<Produto|null>(null);
    const [url, setUrl] = useState<string>('');
    const [tokey,setTokey] = useState<string>('')
    const { chave ,vend } = useGlobalSearchParams()

    useEffect(() => {
        fetchConfigUrl()
        fetchUserTokey()
       },[]);
    useEffect(() => {
    if (url && tokey && chave) {
        fetchProduct();
    }
    }, [url, tokey,chave]);

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

    const fetchProduct = async () => {
        try {
          const id = chave
          const formData = { id };
      
          const uploadResponse = await fetch(url + 'getproduct', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const json = await uploadResponse.json() ;
      
          if (uploadResponse.ok) {
            if (json&& json.cidade !== "Nenhum produto encontrado"){
                setSelectedProduto(json)
            }else{
                console.error('produto:',json)
            }
          } else {
            console.error('Erro ao obter endereço:', json);
            Alert.alert('Erro', 'Erro ao carregar endereço.');
          }
        } catch (error) {
          console.error('Erro ao conectar endereço:', error);
          Alert.alert('Erro', 'Erro ao conectar ao servidor.');
        }
        
        
    };

    const addcart = async()=>{
      try {
        const id = selectedProduto?.id
        const quantity = 0
        const formData = { tokey,id,quantity };
    
        const uploadResponse = await fetch(url + 'addcart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const json:Produto = await uploadResponse.json() ;
    
        if (uploadResponse.ok) {
          Alert.alert( 'produto adicionado');
          
        } else {
          console.error('Erro ao obter endereço:', json);
          Alert.alert('Erro', 'Erro ao carregar endereço.');
        }
      } catch (error) {
        console.error('Erro ao conectar endereço:', error);
        Alert.alert('Erro', 'Erro ao conectar ao servidor.');
      }
    }
  
    return (
        <SafeAreaView>      
            <View style={styles.topbox}>
                <View style={styles.iconbox}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Image style={styles.image} source={require('../assets/4.png')} />
                </TouchableOpacity>
                </View>
            </View>
            {selectedProduto && (
                <ScrollView>
                <View style={stylesp.modalContainer}>
                    <Text style={stylesp.modalProductName}>{selectedProduto.name}</Text>
                    <ScrollView horizontal={true} style={stylesp.modalImagesContainer}>
                    {selectedProduto.images.map((image, idx) => (
                        <Image key={idx} source={{ uri: image }} style={stylesp.modalProductImage} />
                    ))}
                    </ScrollView>
                    <Text style={stylesp.modalProductPrice}>por R${selectedProduto.value.toFixed(2)}</Text>
                    <Text style={stylesp.modalProductDescription}>Disponivel em estoque: {selectedProduto.quantity}</Text>
                    {!vend&&
                    <TouchableOpacity style={styles.botonNC} onPress={() => { addcart() }}>
                    <Text style={{ color: '#10d010', fontSize: 30 }}>adicionar ao carrinho</Text>
                    </TouchableOpacity>}
                    
                    <Text style={stylesp.modalProductDescription}>Descrição do produto: {selectedProduto.description}</Text>

                </View>
                </ScrollView>
            )}
            
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