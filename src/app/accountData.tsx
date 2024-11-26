import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View,Button,ScrollView,TextInput, Alert, Text, Image, TouchableOpacity } from 'react-native';
import { useUserDatabase,UserDatabase } from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingScreen from '@/components/LoadingScreen';
import { router } from 'expo-router';

export default function MyProfile() {
    const [url, setUrl] = useState<string>('');
    const [tokey, setTokey] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false)
    const UserDatabase = useUserDatabase();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password2, setPassword2] = useState('');
    const [showPassword2, setShowPassword2] = useState<boolean>(false);
    const [password3, setPassword3] = useState('');
    const [showPassword3, setShowPassword3] = useState<boolean>(false);

    useEffect(() => {
      fetchConfigUrl()
      fetchUserTokey()
     },[]);
     useEffect(() => {
        if(url&&tokey){fetchUserProfile()}
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
    const fetchUserProfile = async () => {
        try {
            const response = await fetch(url+'login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokey}),
            });
            const data = await response.json();
            if (response.ok) {
                setEmail( data.email)
                setName(data.name)
            } 
  
        } catch (error) {
          console.error('myProfiles.userprofiler:',error)
        }
      };;
    const isFormValid = () => {
        const validatePassword = (password:String,password2:String) => {
            return password === password2;
        };
        const validateEmail = (email:String) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };
        
        if (!name || !email ||!password || !password2 || !password3) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return false;
        }
        if (!validatePassword(password,password2)) {
            Alert.alert('Erro', 'Senhas diferentes.');
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert('Erro', 'Formato de e-mail inválido.');
            return false;
        }
        return true;
    };
    const valid = async () =>{
        const password = password3
        try {
            const response = await fetch(url+'valid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokey,password}),
            });
            const data = await response.json();
            if (response.ok) {
                if (data.res=='ok'){
                    return true
                } else{
                    Alert.alert('senha atual incoreta')
                    return false
                }
            }else{
              return false
            }
  
        } catch (error) {
          console.error('myProfiles.userprofiler:',error)
        }
    }
    const upload = async () => {
      setLoading(true)
      if(!isFormValid()) {setLoading(false);return}
      if(!await valid()) {setLoading(false);return}
      try {
       
        const formData = {tokey,name,email,password}
        const uploadResponse = await fetch(url+'updateuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const data: UserDatabase[]= await UserDatabase.serchByTokey(tokey);
        const json= await uploadResponse.json()
        if (uploadResponse.ok) {
          const tokey1 = json.tokey;
          const use = 1;
          const vendedor = data[0].vendedor

          UserDatabase.create({tokey:tokey1, use, name, vendedor});
          UserDatabase.delet(tokey);
          Alert.alert('ok', 'dados atualizados')
          setLoading(false)
          router.push('/indexv')
        } else {
          Alert.alert('Erro', json.error || ' tente novamente mais tarde')
        }
      } catch (error) {
        console.error('Error uploading:', error)
        Alert.alert('Erro', 'Erro ao conectar ao servidor')
      } finally {
        setLoading(false)
      }
    }
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
                <Text>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />      
                <View style={styles.inputContainer}>
                    <Text>E-mail</Text>
                        <TextInput
                        style={styles.input}
                        placeholder="ex...123@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        />
                        
                    <Text>Senha atual</Text>
                    <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="***********"
                        value={password3}
                        onChangeText={setPassword3}
                        secureTextEntry={!showPassword3}
                    />
                    <TouchableOpacity onPress={() => setShowPassword3(!showPassword3)} style={styles.eyeIcon}>
                        <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#10d010"/>
                    </TouchableOpacity>
                    </View>  
                    <Text>Nova senha</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="***********"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#10d010"/>
                        </TouchableOpacity>
                    </View>  
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="***********"
                            value={password2}
                            onChangeText={setPassword2}
                            secureTextEntry={!showPassword2}
                        />
                        <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)} style={styles.eyeIcon}>
                            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#10d010"/>
                        </TouchableOpacity>
                    </View>  


                </View>  
            </View>
                <Button title="editar dados da conta" onPress={upload}/>  

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