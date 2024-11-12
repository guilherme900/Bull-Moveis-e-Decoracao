import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { readConfigFile } from '@/app/login';


export type UseImage = {
  imagebase64:string
}
export default function App() {
  const [images,setImages] = useState<UseImage[]>([])    

  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);  // Para o preview em base64
  const [loading, setLoading] = useState(false);  // Estado de carregamento
  const [error, setError] = useState<string | null>(null);  // Para mensagens de erro    
  const [url, setUrl] = useState<string>('');

  // Fetching URL de configuração ao inicializar o componente
  useEffect(() => {
    const fetchConfigUrl = async () => {
      const configUrl = await readConfigFile();
      setUrl(configUrl);
    };
    fetchConfigUrl();
  }, []);


  // Função para selecionar a imagem
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
     
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const base64Uri = await convertToBase64(uri)
    // Criar um objeto do tipo UseImage
    const newImage: UseImage = { imagebase64: base64Uri };

    // Concatenar o novo objeto ao array de imagens
    setImages((prevImages) => [...prevImages, newImage]);

    }
  };

  // Função para converter a imagem para Base64
  const convertToBase64 = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  // Função para enviar a imagem ao servidor
  const uploadImage = async () => {
    if (!image) {
        alert('No image selected');
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Cria o objeto JSON com a imagem em Base64
        const imageData = {
            imageBase64: image,  // Incluindo a imagem em Base64
        };
        
        // Envia o JSON com a imagem Base64 para o servidor
        const uploadResponse = await fetch('http://192.168.1.69:5000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(imageData), // Envia o objeto JSON com a imagem Base64
        });

        const json = await uploadResponse.json();
        if (uploadResponse.ok) {
            setImagePreview(json.image)
            Alert.alert('Success', 'Image uploaded successfully');
        } else {
            setError(json.error || 'Error uploading image');
            Alert.alert('Error', json.error || 'Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        setError('Upload failed');
        Alert.alert('Error', 'Upload failed');
    } finally {
        setLoading(false);
    }
};


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Button title="Pick an image from gallery" onPress={pickImage} />

      {image && (
        <View style={{ marginVertical: 20 }}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        </View>
      )}

      {imagePreview && !loading && (
        <View style={{ marginVertical: 20 }}>
          <Text>Image Preview:</Text>
          <Image source={{ uri: imagePreview }} style={{ width: 200, height: 200 }} />
        </View>
      )}

      {loading ? (
        <Text>Uploading...</Text>
      ) : (
        <Button title="Upload Image" onPress={uploadImage} />
      )}

      {error && (
        <Text style={{ color: 'red', marginTop: 20 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
