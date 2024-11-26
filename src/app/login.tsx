import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUserDatabase } from '@/database/useUserDatabase';
import { SafeAreaView, StyleSheet, View, Text, TextInput,BackHandler, TouchableOpacity, Alert } from 'react-native';
import LoadingScreen from '@/components/LoadingScreen';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface LoginResponse {
  name: string;
  email: string;
  vendedor: string;
  password: string;
  message?: string;
}

export async function readConfigFile() {
  const configDir = `${FileSystem.documentDirectory}configUrl`;
  const configFilePath = `${configDir}/config.json`;

  try {
    const configContent = await FileSystem.readAsStringAsync(configFilePath);
    const config = JSON.parse(configContent)['url'];
    return config;
  } catch (error) {
    console.error('Erro ao ler o arquivo de configuração:', error);
    return '';
  }
}

export default function Login() {
  useEffect(() => {
    const backAction = () => {router.push('/');return true;};
    const backHandler = BackHandler.addEventListener('hardwareBackPress',backAction,);
    return () => backHandler.remove();
  }, []);

  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const UserDatabase = useUserDatabase();
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const fetchConfigUrl = async () => {
      const configUrl = await readConfigFile();
      setUrl(configUrl);
    };

    fetchConfigUrl();
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Tempo Esgotado')), 2000)
    );

    try {
      const response = await Promise.race([
        fetch(url + 'login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }),
        timeout,
      ]);

      const data: LoginResponse = await response.json();
      setLoading(false);

      if (response.ok) {
        const tokey = data.password;
        const use = 1;
        const name = data.name;
        const vendedor = data.vendedor === 'V' ? 1 : 0;

        UserDatabase.create({tokey, use, name, vendedor});
        router.push('/');
      } else {
        Alert.alert('Erro', data.message || 'Erro desconhecido');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
            <Icon 
              name={showPassword ? 'eye' : 'eye-slash'} 
              size={20} 
              color="#10d010" 
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button1} onPress={() => { router.push('/register'); }}>
          <Text style={styles.buttonText1}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <View style={{height:20}}/>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => { router.push('/register'); }}>
          <Text style={styles.buttonText1}>Criar Cadastro</Text>
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
