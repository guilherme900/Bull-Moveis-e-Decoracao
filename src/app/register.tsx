import React, { useState,useEffect } from 'react';
import{useRouter}  from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity,BackHandler, Alert, Switch } from 'react-native';
import LoadingScreen from '@/components/LoadingScreen';
import {useUserDatabase} from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';

export default function Register() {
    useEffect(() => {
      const backAction = () => {router.push('/');return true;};
      const backHandler = BackHandler.addEventListener('hardwareBackPress',backAction,);
      return () => backHandler.remove();
    }, []);
  
    const UserDatabase = useUserDatabase()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password2, setPassword2] = useState('');
    const [showPassword2, setShowPassword2] = useState<boolean>(false);
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
      const fetchConfigUrl = async () => {
        const configUrl = await readConfigFile();
        setUrl(configUrl);
      };
      fetchConfigUrl();
    },[]);
    

    const isFormValid = () => {
        const validatePassword = (password:String,password2:String) => {
            return password === password2;
        };
        const validateEmail = (email:String) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };
        
        const validateCpf = (cpf:string) => {
            return cpf.length === 11; // CPF tem 11 dígitos.
        };    
        const validateCnpj = (Cnpj:string) => {
            return Cnpj.length === 14; // CNPJ tem 14.
        };
        
        if (!name || !email ||!password || !password2 || !cpfCnpj) {
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
        if (!isSeller){
            if (!validateCpf(cpfCnpj)) {
                Alert.alert('Erro', 'CPF inválido. Deve ter 11 dígitos.');
                return false;
            }
        }else{
            if (!validateCnpj(cpfCnpj)) {
                Alert.alert('Erro', 'CNPJ inválido. Deve ter 14 dígitos.');
                return false;
            }
        }
        return true;
    };
    
    const handleRegister = async () => {
        setLoading(true);
        if (!isFormValid()) {setLoading(false);return}
        try {
            const response = await fetch(url+'register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name,email,password,cpfCnpj,isSeller }),
            });
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                const tokey = data.data;
                const use = 1;
                const vendedor = isSeller === true ? 1 : 0;
        
                UserDatabase.create({tokey, use, name, vendedor});
                Alert.alert('Cadastrado');
                router.push('/'); 
            } else {
                Alert.alert('Erro', data.message);
            }

        } catch (error) {
            setLoading(false);
            Alert.alert('Erro', 'Erro ao conectar ao servidor');
        }
    };
    const cpforCnpj =()=>{
        if(isSeller){return 'CNPJ'}else{return 'CPF'}
    }
    if (loading) {return <LoadingScreen />}
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registrar</Text>
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
                    <Text>Senha</Text>
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
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Você é um vendedor?</Text>
                    <Switch
                        value={isSeller}
                        onValueChange={setIsSeller}
                        thumbColor={isSeller ? '#10d010' : '#f4f3f4'}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                    />
                </View>
                <Text>{cpforCnpj()}</Text>
                <TextInput
                    style={styles.input}
                    placeholder = ""
                    value={cpfCnpj}
                    onChangeText={setCpfCnpj}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
                
                <Text>Já Tem Conta </Text>
                <TouchableOpacity style={styles.button1} onPress={() => { router.push('/login'); }}>
                    <Text style={styles.buttonText1}>Faça Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
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
    button1: {
      backgroundColor: '#fff',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#10d010',
      borderWidth: 3,
      borderRadius: 5,
    },
    buttonText1: {
      color: '#10d010',
      fontSize: 18,
      fontWeight: 'bold',
    },
});
