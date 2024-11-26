import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View,Button,ScrollView,TextInput, Alert, Text, Image, TouchableOpacity } from 'react-native';
import { useUserDatabase } from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import {Endereco} from '@/app/indexv';
import LoadingScreen from '@/components/LoadingScreen';
import { router,useGlobalSearchParams} from 'expo-router';

 
const ender ={cep:'',uf:'',cidade:'',rua:'',numero:0,}
export default function MyProfile() {
    const [url, setUrl] = useState<string>('');
    const [tokey, setTokey] = useState<string>('');
    const [endereco,setEndereco] = useState<Endereco>(ender); 
    const [loading,setLoading] = useState<boolean>(false)
    const UserDatabase = useUserDatabase();
    const { chave } = useGlobalSearchParams()

    useEffect(() => {
      fetchConfigUrl()
      fetchUserTokey()
     },[]);
    useEffect(() => {
      if(url&&tokey){getendereco()}
    },[url,tokey]);
    useEffect(()=>{
      if(endereco.cep.length == 9){
        const numericCep = endereco.cep.replace(/\D/g, '');
        getenderecocep(numericCep)
      }
    },[endereco.cep])

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
    const getenderecocep = async (cep:string)=>{
      type Retorno ={
        localidade:string,
        uf:string

      }
      try {;
        const uploadResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
          method: 'GET'
        });
    
        const json: Retorno = await uploadResponse.json() ;
    
        if (uploadResponse.ok) {
          if (json) {
            setEndereco({ ...endereco,uf: json.uf,cidade: json.localidade})
          } else {
            console.log('sem enderecocpf');
          }
        } else {
          console.error('Erro ao obter endereço:', json);
        }
      } catch (error) {
        console.error('Erro ao conectar endereço:', error);
      }
    }
    const upload = async () => {
      if (!endereco.cep || !endereco.uf || !endereco.cidade || !endereco.rua || !endereco.numero) {
        Alert.alert('Error', 'Todos os capor são obrigatorios!.')
        return
      }
      if (endereco.cep.length != 9 ){
        Alert.alert('Error', 'formato cpf incoreto!.')
        return
      }
      if (endereco.uf.length != 2 ){
        Alert.alert('Error', 'formato uf incoreto!.')
        return
      }
      setLoading(true)
      const cep    = endereco.cep
      const uf     = endereco.uf
      const cidade = endereco.cidade
      const rua    = endereco.rua
      const numero = endereco.numero
      try {
       
        const formData = {tokey,cep,uf,cidade,rua,numero}
        const uploadResponse = await fetch(url+'setendereco', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
  
        const json = await uploadResponse.json()
        if (uploadResponse.ok) {
          setLoading(false)
          if(chave){
            const ad = cidade+', '+uf+', '+rua+', '+String(numero)
            router.push({
            pathname: '/cart',
            params: { chave:ad },
        });
          }else{
          Alert.alert('ok', 'Endereço atualizado')
          router.push('/indexv')}
        } else {
          Alert.alert('Erro', json.error || ' tente novamente mais tarde')
        }
      } catch (error) {
        console.error('Error uploading endereco:', error)
        Alert.alert('Erro', 'Erro ao conectar ao servidor')
      } finally {
        setLoading(false)
      }
    }
    const formatCep = (cep: string) => {
      let numericCep = cep.replace(/\D/g, '');
      numericCep = numericCep.replace(/(\d{5})(\d{1})/, '$1-$2')
        return numericCep
      
      
    };

    if (loading){
      return<LoadingScreen/>
    }

    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.topbox}>
                <View style={styles.iconbox}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Image style={styles.image} source={require('../assets/4.png')} />
                    </TouchableOpacity>
                </View>
            </View>
      <View style={styles.conteudo}>
        <ScrollView>
        <View style={styles.inputContainer}>
        <Text style={styles.modalProductName}>  Cep</Text>
          <TextInput
            style={styles.input}
            placeholder="00000-000"
            value={endereco.cep}
            onChangeText={(cep) => {
              const formattedCep = formatCep(cep);
              setEndereco({ ...endereco, cep: formattedCep });
            }}
            keyboardType="numeric"
          />

          <Text style={styles.modalProductName}>  UF</Text>
          <TextInput
            style={styles.input}
            placeholder="uf"
            value={endereco.uf}
            onChangeText={(uf) => {
              setEndereco({ ...endereco, uf: uf })
            }}
          />
          <Text style={styles.modalProductName}> Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="cidade"
            value={endereco.cidade}
            onChangeText={(cidade) => {
              setEndereco({ ...endereco, cidade:cidade });
            }}
          />
          <Text style={styles.modalProductName}>  Rua</Text>
          <TextInput
            style={styles.input}
            placeholder="rua"
            value={endereco.rua}
            onChangeText={(rua) => {
              setEndereco({ ...endereco, rua:rua });
            }}
          />
          <Text style={styles.modalProductName}>  Numero</Text>
          <TextInput
            style={styles.input}
            placeholder="numero"
            value={String(endereco.numero)}
            onChangeText={(value) => {
              const numericValue = value.replace(/\D/g, '');
              setEndereco({ ...endereco, numero: Number(numericValue) });
            }}
          />
        </View>{!chave?(
        <Button title="editar endereço" onPress={upload}/>  ):(
        <Button title="confirmação dos dados" onPress={(upload)}/>
        )}

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