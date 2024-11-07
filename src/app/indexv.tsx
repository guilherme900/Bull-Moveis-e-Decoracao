import {Link,router} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,ScrollView,Pressable ,PressableProps,Text,Image,TouchableOpacity,Modal,BackHandler,FlatList} from 'react-native';
import { Card } from 'react-native-paper';
import {useUserDatabase,UserDatabase} from '@/database/useUserDatabase';
import {Rconta} from '@/components/rcontas';
import {readConfigFile} from '@/app/login';

export default function Index(){
  useEffect(() => {
    const backAction = () => {BackHandler.exitApp();return true;};
    const backHandler = BackHandler.addEventListener('hardwareBackPress',backAction,);
    return () => backHandler.remove();
  }, []);

  const UserDatabase = useUserDatabase()
  const [tokey,setTokey] = useState('')
  const [user,setuser]=useState('faça login');
  const [option, setOption] = useState(false);
  const [login ,  setLogin] = useState(false);
  const [logado, setLogado] = useState(false);
  const [contas, setContas] = useState<UserDatabase[]>([])
  const [cart  ,   setCart] = useState(false);
  const [produto,setproduto] = useState(false); 
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
      const fetchConfigUrl = async () => {
        const configUrl = await readConfigFile();
        setUrl(configUrl);
      };
      fetchConfigUrl();
    },[]);

  const logout = async () => {
    await UserDatabase.delet(tokey);
    const response = await UserDatabase.serchByuse(0)||[]
    if(response[0]){
      await UserDatabase.update(response[0].tokey)
    }else{
      setLogado(false);
      setuser('faça login');
      setTokey('');
      router.push('/')
    }
  };

  const Contas = async() =>{
    const response = await UserDatabase.serchByuse(0)
    setContas(response|| [])
  }
  const perfil = async() =>{
    const response = await UserDatabase.serchByuse(1)   
    if(response && response.length > 0){
      if(response[0]['vendedor']==0){router.push('/')}
      setuser(response[0]['name'])
      setTokey(String(response[0]['tokey']))
      setLogado(true)
      return response
    }else{
      setuser ('faça login')
    }
  }
  const Conteudo =()=>{
    return( 
      <View style={{justifyContent:'center',alignItems:'center'}}>
    <Text style={{fontSize:20}}>
      você não tem produtos anunciadao
    </Text>
    <TouchableOpacity style={{padding:10,alignItems:'center'}}>
      <Text style={{fontSize:20}}>
        novo produto
      </Text>
    </TouchableOpacity>
    </View>
    )
  }
  perfil()
  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent={true} visible={option} onRequestClose={()=>setOption(false)}>
        <View style={styles.option}>
          <View style={styles.optionbox}>
            <View style={styles.prefilbox}>
              <TouchableOpacity style={styles.perfil} onPress={()=>{if(logado){Contas();setLogin(true);setOption(false)}else{router.push('/login')}}}>
                <View style={styles.iconperfil}>
                </View>
                <View style={styles.nameperfil}>
                  <Text>{user}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity style={{margin:20}} onPress={()=>{router.push(`/mypurchases?tokey=${tokey}`)}}>
            <Text>Minhas vendas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{margin:20}} onPress={()=>{router.push('/favorites')}}>
            <Text>Meus anuncios</Text>
            </TouchableOpacity>

            
            </View>
          </View>
          <TouchableOpacity style={{flex:1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}} onPress={()=>{setOption(false)}}/>
        </View>
      </Modal>
      <Modal transparent={true} visible={login}  onRequestClose={()=>{setLogin(false);setOption(true)}}>
        <View style={styles.option}>
          <View style={styles.optionbox}>
            <View style={styles.prefilbox}>
              <View style={styles.perfil}>
              <TouchableOpacity onPress={()=>{router.push('/myProfiles')}}>
                
                  <View style={styles.iconperfil}>
                  </View>
                </TouchableOpacity>
                  <View style={styles.nameperfil}>
                    <Text>{user}</Text>
                  </View>
                <TouchableOpacity style={{marginTop:10,width:51}} onPress={logout}>
                  <Text style={{  fontSize: 20 ,backgroundColor:'#bbb',borderRadius:10}}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>       
              <FlatList
                data={contas}
                keyExtractor={(item) => String(item.tokey)}
                renderItem={({item}) => <Rconta data={item} onPress={() =>{UserDatabase.update(String(item.tokey));Contas()}}/>}
                contentContainerStyle={{gap:16}}
              />
              <TouchableOpacity style={styles.botonNC} onPress={() =>{router.push('/login')}}>
                <Text style={{color:'#10d010',fontSize:30}}>
                  + Nova Conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{flex:1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}} onPress={()=>{setLogin(false);setOption(false)}}/>
        </View>
      </Modal>

      <View style={styles.topbox}>
        <View style={styles.iconbox}>
          <TouchableOpacity onPress={()=>{setOption(true)}}>
            <Image style={styles.image} source={require('../assets/1.png')}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{router.push('/search'); }}>
            <View style={styles.textbox}>
            <Image style={styles.lupa} source={require('../assets/2.png')}
            />
            <Text style={{margin:10}}>Pesquisar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{router.push('/cart'); }}>
            <Image style={styles.image} source={require('../assets/3.png')}/>
          </TouchableOpacity>
        </View>
      </View>
      <View>
      <Conteudo/>
      </View>
    </SafeAreaView>
  );
  
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
  }
});



