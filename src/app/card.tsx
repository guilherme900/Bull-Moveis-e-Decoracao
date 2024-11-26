import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, ScrollView, TextInput, Alert, Text, Image, TouchableOpacity } from 'react-native';
import { useUserDatabase } from '@/database/useUserDatabase';
import { readConfigFile } from '@/app/login';
import LoadingScreen from '@/components/LoadingScreen';
import { router } from 'expo-router';

const initialCardInfo = { numero: '', nome: '', validade: '', cvv: '' };

export default function CreditCardPage() {
  const [url, setUrl] = useState<string>('');
  const [tokey, setTokey] = useState<string>('');
  const [cardInfo, setCardInfo] = useState(initialCardInfo);
  const [loading, setLoading] = useState<boolean>(false);
  const UserDatabase = useUserDatabase();

  useEffect(() => {
    fetchConfigUrl();
    fetchUserTokey();
  }, []);

  useEffect(() => {
    if (url && tokey) {
      //getCardInfo();
    }
  }, [url, tokey]);

  const fetchConfigUrl = async () => {
    const configUrl = await readConfigFile();
    setUrl(configUrl);
  };

  const fetchUserTokey = async () => {
    const response = await UserDatabase.serchByuse(1);
    if (response && response.length > 0) {
      setTokey(response[0].tokey);
    }
  };

  const getCardInfo = async () => {
    try {
      const formData = { tokey };
      const uploadResponse = await fetch(url + 'getCardInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await uploadResponse.json();
      if (uploadResponse.ok) {
        if (json && json.numero) {
          setCardInfo(json);
        } else {
          console.log('Sem informações do cartão');
        }
      } else {
        console.error('Erro ao obter informações do cartão:', json);
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  };

  const upload = async () => {
    if (!cardInfo.numero || !cardInfo.nome || !cardInfo.validade || !cardInfo.cvv) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }
    if (cardInfo.numero.length !== 19) {
      Alert.alert('Erro', 'O número do cartão deve ter 16 dígitos!');
      return;
    }
    if (cardInfo.cvv.length !== 3) {
      Alert.alert('Erro', 'O código CVV deve ter 3 dígitos!');
      return;
    }
    fim()
    return
    /*
    setLoading(true);
    const { numero, nome, validade, cvv } = cardInfo;
    try {
      const formData = { tokey, numero, nome, validade, cvv };
      const uploadResponse = await fetch(url + 'setCardInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await uploadResponse.json();
      if (uploadResponse.ok) {
        Alert.alert('Sucesso', 'Informações do cartão atualizadas');
        router.push('/indexv');
      } else {
        Alert.alert('Erro', json.error || 'Tente novamente mais tarde');
      }
    } catch (error) {
      console.error('Erro ao enviar informações do cartão:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }*/
  };
  const fim =()=>{
    router.push({
        pathname: '/address',
        params: { chave:'card' },
    });
      }
  const formatCardNumber = (numero: string) => {
    return numero.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbox}>
        <View style={styles.iconbox}>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Image style={styles.image} source={require('../assets/4.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.conteudo}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.modalProductName}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="#### #### #### ####"
              value={cardInfo.numero}
              onChangeText={(numero) => {
                const formattedNumero = formatCardNumber(numero);
                setCardInfo({ ...cardInfo, numero: formattedNumero });
              }}
              keyboardType="numeric"
            />

            <Text style={styles.modalProductName}>Nome do Titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Titular"
              value={cardInfo.nome}
              onChangeText={(nome) => setCardInfo({ ...cardInfo, nome })}
            />

            <Text style={styles.modalProductName}>Validade (MM/AA)</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/AA"
              value={cardInfo.validade}
              onChangeText={(validade) => setCardInfo({ ...cardInfo, validade })}
            />

            <Text style={styles.modalProductName}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={cardInfo.cvv}
              onChangeText={(cvv) => setCardInfo({ ...cardInfo, cvv })}
              keyboardType="numeric"
            />
          </View>

          <Button title="continuar para endereço" onPress={upload} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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
  inputContainer: {
    width: '100%',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
