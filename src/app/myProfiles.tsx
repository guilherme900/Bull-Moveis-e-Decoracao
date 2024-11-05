import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text,Image, TouchableOpacity } from 'react-native';
import { useUserDatabase } from '@/database/useUserDatabase';
import {readConfigFile} from '@/app/login';
import { router } from 'expo-router';

 

export default function MyProfile() {
    const [url, setUrl] = useState<string>('');
    const [tokey, setTokey] = useState<string>('');
    const [userInfo, setUserInfo] = useState({ name: 'nome', email: 'email' });

    const UserDatabase = useUserDatabase();

    const fetchUserTokey = async () => {
        const response = await UserDatabase.serchByuse(1);
        if (response && response.length > 0) {
          setTokey(response[0].tokey) 
        }
    };

    const fetchUserProfile = async () => {
        await fetchUserTokey()          
        try {
            const response = await fetch(url+'login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tokey}),
            });
            const data = await response.json();
            console.log('data:',data)
            if (response.ok) {
                setUserInfo({ name: data.name, email: data.email })
            } 

        } catch (error) {
        }
    };;
    useEffect(() => {
        const fetchConfigUrl = async () => {
        const configUrl = await readConfigFile();
        setUrl(configUrl);
        };
        fetchConfigUrl();
        fetchUserProfile();
    },[]);
    
    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.topbox}>
                <View style={styles.iconbox}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Image style={styles.image} source={require('../assets/4.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        <View style={styles.profileInfo}>
            <Text style={styles.name}>{userInfo.name}</Text>
            <Text style={styles.email}>{userInfo.email}</Text>
        </View>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/accountData')}>
            <Text style={styles.buttonText}>Dados da Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/security')}>
            <Text style={styles.buttonText}>Segurança</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/address')}>
            <Text style={styles.buttonText}>Endereço</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}
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
  profileInfo: {
    marginBottom: 40,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    color: '#555',
  },
  buttonsContainer: {
    flex: 1,
    padding:20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#50ef50',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
