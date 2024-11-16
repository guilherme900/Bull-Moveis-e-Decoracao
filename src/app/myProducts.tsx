import {router} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,Alert,ScrollView,Text,Image,TouchableOpacity,Modal} from 'react-native';
import {useUserDatabase} from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import{omit} from'lodash';
import { TextInput } from "react-native-paper";


export type Produto = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  value: number;
  images: string[];  
};

export default function Index(){

  const UserDatabase = useUserDatabase()
  const [url, setUrl] = useState<string>('');
  const [tokey,setTokey] = useState<string>('')
  const [produtos,setProdutos] = useState<Produto[]>([]); 
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editarProduto, setditarProduto] = useState<boolean>(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);


  useEffect(() => {
      const fetchConfigUrl = async () => {
        const configUrl = await readConfigFile();
        setUrl(configUrl);
      };
      fetchConfigUrl();
    },[]);

    useEffect(() => {
      if (tokey) {
          getprodutos();
      }
  }, [tokey]);

  
  const perfil = async() =>{
    const response = await UserDatabase.serchByuse(1)   
    if(response && response.length > 0){
      setTokey(String(response[0]['tokey']))
      return response}
  }
  perfil() 

  const getprodutos = async () => {
    try {
      const formData = { tokey };
  
      const uploadResponse = await fetch(url + 'getproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const json: Produto[] = await uploadResponse.json();
  
      if (uploadResponse.ok) {
        if (json && Array.isArray(json) && json.length > 0) {
          setProdutos(json);
        } else {
          console.log('Lista de rodutos  vazia!');
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
  
  const handleProdutoPress = (produto : Produto) => {
    setSelectedProduto(produto);
    setModalVisible(true);
  };

  


  const Conteudo = () => {
  
    return (
      <View style={{ flex: 1 }}>
        <View style={{marginVertical: 30,alignItems:'center'}}>
          <TouchableOpacity  onPress={()=>{router.push('/nProduct')}}>
            <View style={styles.botonNp}>
              <Text style={{fontSize:20}}>
                novo produto
              </Text>
            </View>
          </TouchableOpacity>
          
        </View>  

        <View style={stylesp.produtosContainer}>
          {produtos.length === 0 ? (
            <Text style={stylesp.noProductText}>Nenhum produto encontrado.</Text>
          ) : (
            <ScrollView style={{width:330}}>
            {produtos.map((produto, index) => (
              <TouchableOpacity onPress={() => {console.log(omit(produto, 'images')),handleProdutoPress(produto)}} key={index} style={stylesp.produtoCard}>
                <View  style={stylesp.produtoImageContainer}>
                  <Image source={{ uri: produto.images[0] }} style={stylesp.produtoImage} />
                </View>
                <Text style={stylesp.produtoName}>{produto.name}</Text>
                <Text style={stylesp.produtoValue}>Preço: R${produto.value.toFixed(2)}</Text>
                
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        </View>
  
        {selectedProduto && (
          <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            {!editarProduto ?(<View style={{flex:1}}>

            <View style={{height:55,flexDirection:'column-reverse',backgroundColor: '#10d010',}}>
              <View style={styles.iconbox}>
                <TouchableOpacity onPress={() => { setModalVisible(false) }}>
                  <Image style={styles.image} source={require('../assets/4.png')} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={stylesp.modalContainer}>
              <Text style={stylesp.modalProductName}>Nome do produto: {selectedProduto.name}</Text>
              <Text style={stylesp.modalProductDescription}>Descrição do produto: {selectedProduto.description}</Text>
              <Text style={stylesp.modalProductPrice}>Valor do produto: R${selectedProduto.value.toFixed(2)}</Text>
              <Text style={stylesp.modalProductName}>Estoque: {selectedProduto.quantity}</Text>
              <Text style={stylesp.modalProductName}>Imagems:</Text>
              <ScrollView horizontal={true} style={stylesp.modalImagesContainer}>
                {selectedProduto.images.map((image, idx) => (
                  <Image key={idx} source={{ uri: image }} style={stylesp.modalProductImage} />
                ))}
              </ScrollView>
              
              <TouchableOpacity onPress={() => setditarProduto(true)} style={{marginBottom: 10,padding: 10,backgroundColor: '#4cff4c',borderRadius: 10,}}>
                <Text style={stylesp.closeModalText}>Editar anuncio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={stylesp.closeModalButton}>
                <Text style={stylesp.closeModalText}>Apagar anuncio</Text>
              </TouchableOpacity>
            </View>
            </View>):


            (<View>
              <View style={{height:55,flexDirection:'column-reverse',backgroundColor: '#10d010',}}>

                <View style={styles.iconbox}>
                  <TouchableOpacity onPress={() => { setditarProduto(false) }}>
                    <Image style={styles.image} source={require('../assets/4.png')} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={stylesp.modalContainer}>
              <Text style={stylesp.modalProductName}>Nome do produto: {selectedProduto.name}</Text>
              <TextInput style={styles.input}
                placeholder="Nome"
                value={selectedProduto.name}
                onChangeText={(name)=>{setSelectedProduto({ ...selectedProduto, name: name })}}
              />
              <Text style={stylesp.modalProductDescription}>Descrição do produto: {selectedProduto.description}</Text>
              <Text style={stylesp.modalProductPrice}>Valor do produto: R${selectedProduto.value.toFixed(2)}</Text>
              <Text style={stylesp.modalProductName}>Estoque: {selectedProduto.quantity}</Text>
              <Text style={stylesp.modalProductName}>Imagems:</Text>
              <ScrollView horizontal={true} style={stylesp.modalImagesContainer}>
                {selectedProduto.images.map((image, idx) => (
                  <Image key={idx} source={{ uri: image }} style={stylesp.modalProductImage} />
                ))}
              </ScrollView>
              </View>
            </View>)}
          </Modal>
        )}
      </View>
    );
  };



  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.topbox}>
        <View style={styles.iconbox}>
          <TouchableOpacity onPress={() => { router.push('/indexv'); }}>
            <Image style={styles.image} source={require('../assets/4.png')} />
          </TouchableOpacity>
        </View>

      </View>

      <Conteudo/>

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
  },
  botonNp:{
    borderRadius:30,
    backgroundColor:'#eee',
    justifyContent:'center',
    alignItems:'center',
    height:48,
    width:160
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
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
    color: '#0f0',
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



