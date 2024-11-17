import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert, TextInput, Image, Button, SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import {useUserDatabase} from '@/database/useUserDatabase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { readConfigFile } from '@/app/login';

export type UseImage = {
  imagebase64: string;
}

export default function NProduto() {
    
  const UserDatabase = useUserDatabase()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [valor, setValor] = useState('')
  const [tokey,setTokey] = useState('')
  const [images, setImages] = useState<UseImage[]>([])    
  const [loading, setLoading] = useState(false) 
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    const fetchConfigUrl = async () => {
      const configUrl = await readConfigFile()
      setUrl(configUrl)
    }
    fetchConfigUrl()
  }, [])

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

      const newImage: UseImage = { imagebase64: base64Uri }

      setImages((prevImages) => [...prevImages, newImage])
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

  
  const upload = async () => {
    if (!name || !description || !quantity || !valor || images.length === 0) {
      Alert.alert('Error', 'Todos os capor são obrigatorios!.')
      return
    }

    setLoading(true)

    try {
     
      const formData = {
        tokey,
        name,
        description,
        quantity,
        valor,
        images: images.map(image => image.imagebase64),
      }

      const uploadResponse = await fetch(url+'uploadproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Enviar o formulário completo
      })

      const json = await uploadResponse.json()
      if (uploadResponse.ok) {
        Alert.alert('ok', 'Produto cadastrado')
        setName('')
        setDescription('')
        setQuantity('')
        setValor('')
        setImages([])
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

  
  function Rimages({ imagebase64 }: UseImage) {
    return (
      <View style={{ marginVertical: 20 }}>
        <Image source={{ uri: imagebase64 }} style={{ width: 200, height: 200 }} />
      </View>
    )
  }

  
  const Listimages = () => {
    return (
      <FlatList
        data={images}
        keyExtractor={(item, index) => String(index)}  // Usando o índice como chave
        renderItem={({ item }) => <Rimages {...item} />}
        horizontal={true}
        contentContainerStyle={{ gap: 16 }}
      />
    )
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
        <View>
        <Text style={styles.title}>Novo Produto</Text>

        <View style={styles.inputContainer}>
          <Text>Nome do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <Text>Descrição do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          <Text>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
          />
          <Text>Valor do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={valor}
            onChangeText={setValor}
          />
        </View>
        <Button title="adicionar imagem" onPress={pickImage} disabled={loading}/>
        <Button title="Enviar Produto" onPress={upload} disabled={loading} />
        <Listimages />
        </View>
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
    borderColor: '#ccc',
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
})

