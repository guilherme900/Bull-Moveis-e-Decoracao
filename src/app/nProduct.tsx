import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert, TextInput, Image, Button, SafeAreaView,ScrollView, StyleSheet, View} from "react-native";
import {useUserDatabase} from '@/database/useUserDatabase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { TextInputMask } from 'react-native-masked-text'; 
import { readConfigFile } from '@/app/login';
import { Produto } from '@/app/myProducts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { includes } from 'lodash';

const p1 = {id:0,name:'',hashtags:'#',description:'',quantity:0,value:0,images:[]}

export default function NProduto() {
    
  const UserDatabase = useUserDatabase() 
  const [tokey,setTokey] = useState<string>('')
  const [produto,setProduto] =  useState<Produto>(p1);
  const [loading, setLoading] = useState<boolean>(false) 
  const [url, setUrl] = useState<string>('')


  useEffect(() => {
    const fetchConfigUrl = async () => {
      const configUrl = await readConfigFile()
      setUrl(configUrl)
    }
    fetchConfigUrl()
  }, [])
  useEffect(() => {
    geraHashtag()
  },[produto.name])

  const user = async() =>{
    const response = await UserDatabase.serchByuse(1)   
    if(response && response.length > 0){
      if(response[0]['vendedor']==0){router.push('/')}
      setTokey(String(response[0]['tokey']))
      return response
  }}
  
  const pickImage = async () => {
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
      if (produto) {
        const updatedImages = [...produto.images, base64Uri]
        setProduto({ ...produto, images: updatedImages })
      }
    }
  }

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

  const RemoveImage = (imageToRemove: string) => {
    if (produto) {
      const updatedImages = produto.images.filter((image) => image !== imageToRemove);
      setProduto({ ...produto, images: updatedImages });
    }
  };

  const geraHashtag = async () => {
    const liname = produto.name.split(' ')
    var va =''
    var hashtag :string
    var hashtags =''
    for (let v of liname){
      if (va){
        hashtag = va+'-'+v
        va =''
      }else{hashtag = v}
      
      if ( ['de','do','da'].includes(v)){ 
        va = v
        console.log(va)
      }else{hashtags = hashtags+'#'+hashtag}
    }
    
    
    setProduto({ ...produto, hashtags:hashtags });
  }
  const upload = async () => {
    if (!produto.name || !produto.description || !produto.quantity || !produto.value || produto.images.length === 0) {
      Alert.alert('Error', 'Todos os capor são obrigatorios!.')
      return
    }
    setLoading(true)
    const name        = produto.name
    const hashtags     = produto.hashtags
    const description = produto.description
    const quantity    = produto.quantity
    const valor       = produto.value
    const images      = produto.images
    try {
     
      const formData = {
        tokey,name,hashtags,description,quantity,valor,images}
      const uploadResponse = await fetch(url+'uploadproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const json = await uploadResponse.json()
      if (uploadResponse.ok) {
        Alert.alert('ok', 'Produto cadastrado')
        setProduto(p1)
      } else {
        Alert.alert('Erro', json.error || 'produto nao cadastrado!\n tente novamente mais tarde')
      }
    } catch (error) {
      console.error('Error uploading product:', error)
      Alert.alert('Erro', 'Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }



  
  user()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbox}>
        <View style={styles.iconbox}>
          <TouchableOpacity onPress={() => { router.push('/indexv') }}>
            <Image style={styles.image} source={require('../assets/4.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.conteudo}>
        {!loading&&
        <ScrollView>
        <Text style={styles.title}>Novo Produto</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.modalProductName}>  Nome do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={produto.name}
            onChangeText={(name) => {
              setProduto({ ...produto, name: name })
            }}
          />
          <Text style={styles.modalProductName}>  Palavras chave do produto ex:#sofa#branco</Text>
          <TextInput
            style={styles.input}
            placeholder="ex:#sofa#branco"
            value={produto.hashtags}
            onChangeText={(hashtags) => {
              setProduto({ ...produto, hashtags:hashtags });
            }}
          />
          <Text style={styles.modalProductName}>  Descrição do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={produto.description}
            onChangeText={(description) => {
              setProduto({ ...produto, description:description });
            }}
          />
          <Text style={styles.modalProductName}>  Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={String(produto.quantity)}
            onChangeText={(value) => {
              const numericValue = value.replace(/\D/g, '');
              setProduto({ ...produto, quantity: Number(numericValue) });
            }}
          />
          <Text style={styles.modalProductName}>  Valor do Produto</Text>
          <TextInputMask
                  style={styles.input}
                  type={'money'}
                  value={produto.value.toFixed(2).replace('.', ',')} 
                  onChangeText={(value) => {
                    const numericValue = value.replace(/\D/g, '');
                    const formattedValue = (Number(numericValue) / 100).toFixed(2);
                    setProduto({ ...produto, value: Number(formattedValue) });
                  }}
                  options={{
                    precision: 2,   
                    separator: ',',  
                    delimiter: '.',  
                  }}
                  keyboardType="numeric"
                  placeholder="000.00"
                />
        </View>
        <Button title="adicionar imagem" onPress={pickImage} disabled={loading}/>
        <Button title="Enviar Produto" onPress={upload} disabled={loading} />   
        {produto &&
        <ScrollView horizontal={true} style={{marginBottom: 20}}>
          {produto.images.map((image, idx) => (
            <View key={idx} style={{position: 'relative',}}>
              <Image key={idx} source={{ uri: image }} style={styles.ProductImage} />                      
              <TouchableOpacity
                style={styles.trashIconContainer}
                onPress={() => RemoveImage(image)}
              >
              <Icon name="trash-can" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        }
        </ScrollView>
        }

        {loading && 
        <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20}}>Enviando...</Text>
          <Text style={{fontSize:20}}>Aguarde</Text>
        </View>
        }


      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  conteudo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'left',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#10d010',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ProductImage: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  trashIconContainer: {
    position: 'absolute',
    top: 0,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 1)',
    padding: 5,
    borderRadius: 20,
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})

