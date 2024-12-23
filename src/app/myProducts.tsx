import {router} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,Alert,ScrollView,Text,Image,TouchableOpacity} from 'react-native';
import {useUserDatabase} from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import{omit} from'lodash';
import { TextInputMask } from 'react-native-masked-text'; 
import { TextInput } from "react-native-paper";


export type Produto = {
  id: number;
  name: string;
  hashtags: string;
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
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
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
          console.log('Lista de produtos  vazia!');
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
  
  const updateProduto = async (product: Produto) => {
    const id          =product.id
    const name        = product.name
    const hashtags     = product.hashtags
    const description = product.description
    const quantity    = product.quantity
    const valor       = product.value
    const images      = product.images
    try {
      const formData = { tokey,id,name,hashtags,description,quantity,valor,images };
  
      const uploadResponse = await fetch(url + 'updateproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const json = await uploadResponse.json();
      console.log(json)
      if(uploadResponse.ok){Alert.alert('Ok',json.mensagem)
      }else{Alert.alert('Erro',json.error)}
      
      router.push('myProducts')

    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };

  const deletProduto = async (product: Produto) => {
    
    try {
      const id_product = product.id
      const formData = { tokey,id_product};
  
      const uploadResponse = await fetch(url + 'deletproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const json = await uploadResponse.json();
      if(uploadResponse.ok){Alert.alert('Ok',json.mensagem)
      }else{Alert.alert('Erro',json.error)}
      router.push('myProducts')

    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };

  const ProdutoPress = (produto : Produto) => {
    setSelectedProduto(produto);
    setDetailsVisible(true);
  };

  const pickImage = async () => {
    const AddImage = (imageToAdd: string) => {
      if (selectedProduto) {
        const updatedImages = [...selectedProduto.images, imageToAdd]
        setSelectedProduto({ ...selectedProduto, images: updatedImages })
      }
    };

    const convertToBase64 = async (uri: string) => {
      try {
        const response = await fetch(uri)
        const blob = await response.blob()
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
          reader.readAsDataURL(blob)
        })
        return base64
      } catch (error) {
        console.error('Error converting image to base64:', error)
        return ''
      }
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert('Permission', 'Permission to access gallery is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri
      const base64Uri = await convertToBase64(uri)
      AddImage(base64Uri)
      }
    }

  const RemoveImage = (imageToRemove: string) => {
    if (selectedProduto) {
      const updatedImages = selectedProduto.images.filter((image) => image !== imageToRemove);
      setSelectedProduto({ ...selectedProduto, images: updatedImages });
    }
  };

  

  if(selectedProduto && detailsVisible){
    return(
        <SafeAreaView style={styles.container}>
          {!editarProduto ? (
            <View style={styles.container}>
              <View style={{ height: 80, flexDirection: 'column-reverse', backgroundColor: '#10d010' }}>
                <View style={styles.iconbox}>
                  <TouchableOpacity onPress={() => { setDetailsVisible(false); }}>
                    <Image style={styles.image} source={require('../assets/4.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
              <View style={stylesp.modalContainer}>
                <Text style={stylesp.modalProductName}>Nome do produto: {selectedProduto.name}</Text><Text/>
                <Text style={stylesp.modalProductName}>hashtags:</Text>
                <Text style={stylesp.modalProductName}>{selectedProduto.hashtags}</Text><Text/>
                <Text style={stylesp.modalProductName}>Descrição do produto:</Text>
                <Text style={stylesp.modalProductDescription}> {selectedProduto.description}</Text><Text/>
                <Text style={stylesp.modalProductName}>Valor do produto: R${selectedProduto.value.toFixed(2)}</Text>
                <Text style={stylesp.modalProductName}>Estoque: {selectedProduto.quantity}</Text><Text/>
                <Text style={stylesp.modalProductName}>Imagens:</Text>
                <ScrollView horizontal={true} style={stylesp.modalImagesContainer}>
                  {selectedProduto.images.map((image, idx) => (
                    <Image key={idx} source={{ uri: image }} style={stylesp.modalProductImage} />
                  ))}
                </ScrollView>

                <TouchableOpacity onPress={() => setditarProduto(true)} style={{ marginBottom: 10, padding: 10, backgroundColor: '#4cff4c', borderRadius: 10 }}>
                  <Text style={stylesp.closeModalText}>Editar anúncio</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletProduto(selectedProduto)} style={stylesp.closeModalButton}>
                  <Text style={stylesp.closeModalText}>Apagar anúncio</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
            </View>

          ) : (

            <View style={styles.container}>
              <View style={{ height: 80, flexDirection: 'column-reverse', backgroundColor: '#10d010' }}>
                <View style={styles.iconbox}>
                  <TouchableOpacity onPress={() => {
                     setditarProduto(false);setDetailsVisible(false);}}>
                    <Image style={styles.image} source={require('../assets/4.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView >
              <View style={stylesp.modalContainer}>
                <Text style={stylesp.modalProductName}>Nome do produto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  value={selectedProduto.name}
                  onChangeText={(name) => {
                     setSelectedProduto({ ...selectedProduto, name: name }); }}
                />
                <Text style={stylesp.modalProductName}>Palavras chave do produto ex:#sofa#branco</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex:#sofa#branco"
                  value={selectedProduto.hashtags}
                  onChangeText={(hashtags) => {
                     setSelectedProduto({ ...selectedProduto, hashtags: hashtags }); }}
                />
                <Text style={stylesp.modalProductName}>Descrição do produto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descrição"
                  value={selectedProduto.description}
                  onChangeText={(description) => {
                     setSelectedProduto({ ...selectedProduto, description: description }); }}
                />
                <Text style={stylesp.modalProductName}>Valor do produto</Text>
                <TextInputMask
                  style={styles.input}
                  type={'money'}
                  value={selectedProduto.value.toFixed(2).replace('.', ',')} 
                  onChangeText={(value) => {
                    const numericValue = value.replace(/\D/g, '');
                    const formattedValue = (Number(numericValue) / 100).toFixed(2);
                    setSelectedProduto({ ...selectedProduto, value: Number(formattedValue) });
                  }}
                  options={{
                    precision: 2,   
                    separator: ',',  
                    delimiter: '.',  
                  }}
                  keyboardType="numeric"
                  placeholder="000.00"
                />
                <Text style={stylesp.modalProductName}>Quantidade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="quantidade"
                  value={String(selectedProduto.quantity)}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/\D/g, '');
                    setSelectedProduto({ ...selectedProduto, quantity: Number(numericValue) });
                  }}
                />
                <Text style={stylesp.modalProductName}>Imagens:</Text>
                <TouchableOpacity onPress={() => pickImage()} style={{ marginBottom: 10, padding: 10, backgroundColor: '#4cff4c', borderRadius: 10 }}>
                  <Text style={stylesp.closeModalText}>Adicio imagem</Text>
                </TouchableOpacity>
                <ScrollView horizontal={true} style={stylesp.modalImagesContainer}>
                  {selectedProduto.images.map((image, idx) => (
                    <View key={idx} style={{position: 'relative',}}>
                      <Image source={{ uri: image }} style={stylesp.modalProductImage} />
                      <TouchableOpacity
                      style={stylesp.trashIconContainer}
                      onPress={() => RemoveImage(image)}
                    >
                    <Icon name="trash-can" size={24} color="white" />
                  </TouchableOpacity>
                  </View>
                  ))}
                </ScrollView>
                <TouchableOpacity onPress={() => updateProduto(selectedProduto)} style={{ marginBottom: 10, padding: 10, backgroundColor: '#4cff4c', borderRadius: 10 }}>
                  <Text style={stylesp.closeModalText}>Editar anúncio</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      )
  }else{
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.topbox}>
          <View style={styles.iconbox}>
            <TouchableOpacity onPress={() => { router.push('/indexv'); }}>
              <Image style={styles.image} source={require('../assets/4.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
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
              <ScrollView>
              {produtos.map((produto, index) => (
                <TouchableOpacity onPress={() => ProdutoPress(produto)} key={index} style={stylesp.produtoCard}>
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
        </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
  
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
    backgroundColor:'#0f0',
    justifyContent:'center',
    alignItems:'center',
    height:48,
    width:160
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor:'#fff'
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
    color: '#0c0',
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
    backgroundColor: '#ddd',
  },
  closeModalButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ff4c4c',
    borderRadius: 10,
  },
  closeModalText: {
    color: '#000',
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
  trashIconContainer: {
    position: 'absolute',
    top: 0,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 1)',
    padding: 5,
    borderRadius: 20,
  },
});



