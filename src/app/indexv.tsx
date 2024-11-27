import {Link,router} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,Alert,ScrollView,Pressable ,PressableProps,Text,Image,TouchableOpacity,Modal,BackHandler,FlatList} from 'react-native';
import { Button, Card } from 'react-native-paper';
import {useUserDatabase,UserDatabase} from '@/database/useUserDatabase';
import {Rconta} from '@/components/rcontas';
import {readConfigFile} from '@/app/login';


export type Ordens = {
  id:number;
  id_pro:number,
  name_pro: string;
  valor_pro:number;
  id_cli:number;
  name_cli:string;
  email_cli:string;
  cep_end:string;
  uf_end:string;
  cidade:string;
  rua:string;
  numero:string;
  };

export type Endereco ={
  cep:string, 
  uf:string, 
  cidade:string, 
  rua:string,
  numero:number,
}

export default function Index(){
  useEffect(() => {
    const backAction = () => {BackHandler.exitApp();return true;};
    const backHandler = BackHandler.addEventListener('hardwareBackPress',backAction,);
    return () => backHandler.remove();
  }, []);

  const UserDatabase = useUserDatabase()
  const [tokey,setTokey] = useState<string>('')
  const [user,setuser]=useState<string>('faça login');
  const [option, setOption] = useState<boolean>(false);
  const [login ,  setLogin] = useState<boolean>(false);
  const [logado, setLogado] = useState<boolean>(false);
  const [contas, setContas] = useState<UserDatabase[]>([])
  const [ordens,setOrdens] = useState<Ordens[]>([]); 
  const [endereco,setEndereco] = useState<Endereco|null>(); 
  const [url, setUrl] = useState<string>('');
  

  

  useEffect(() => {
    fetchConfigUrl()
  },[]);

  useEffect(() => {
    if(url&&tokey){getendereco()}
  },[url,tokey]);

  useEffect(() => {
    if(endereco){getordens()}
  },[endereco]);
  

  const fetchConfigUrl = async () => {
    const configUrl = await readConfigFile();
    setUrl(configUrl);
  };
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
        Alert.alert('Erro', 'Erro ao carregar endereço.');
      }
    } catch (error) {
      console.error('Erro ao conectar endereço:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  }

  const handleProdutoPress = (produto:Ordens) => {
    const id = produto.id_pro
    router.push({
        pathname: '/produto',
        params: { chave:id,vend:'s'},
    });
    //setSelectedProduto(produto);
    //setModalVisible(true);
  };  

  const getordens = async()=>{
    try {
      const formData = { tokey };
  
      const uploadResponse = await fetch(url + 'getordens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const json: Ordens[] = await uploadResponse.json();
  
      if (uploadResponse.ok) {
        if (json && Array.isArray(json) && json.length > 0) {
          setOrdens(json)
        } else {
          console.log('Lista de ordens  vazia!');
        }
      } else {
        console.error('Erro ao obter ordens:', json);
        Alert.alert('Erro', 'Erro ao carregar ordens.');
      }
    } catch (error) {
      console.error('Erro ao conectar ordens:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  }

  const enviado = async(ordem:Ordens)=>{
    const id = ordem.id
    try {
      const formData = { tokey,id};
  
      const uploadResponse = await fetch(url + 'enviado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const json = await uploadResponse.json();
  
      if (uploadResponse.ok) {
          console.log('enviado:',json);
          setOrdens(ordens.filter(i => i.id !== id));
      } else {
        console.error('Erro ao mudar ordem:', json);
        Alert.alert('Erro', 'Erro ao mudar ordem');
      }
    } catch (error) {
      console.error('Erro ao conectar enviado:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
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
            {endereco ?(
            <View>
            <TouchableOpacity style={{margin:20}} onPress={()=>{router.push('/mySales')}}>
            <Text>Minhas vendas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{margin:20}} onPress={()=>{router.push('/myProducts')}}>
            <Text>Meus anuncios</Text>
            </TouchableOpacity>
            </View>
            ):(
              <View>
                <View style={{margin:20}}>
                  <Text style={{fontSize:18}}>cadastre um endereço para ter acesso as opnções</Text>
                </View>
              </View>
              )}
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
              <TouchableOpacity style={styles.botonNC} onPress={() =>{router.push('/register')}}>
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
            <Image style={styles.image} source={require('../assets/1.png')}/>
          </TouchableOpacity>
          
            <View style={styles.textbox}>
            <Text style={{margin:10,fontSize:15}}>Area vendedor</Text>
            </View>
            <Image style={styles.image}/>
        </View>
      </View>
      {!endereco?(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20,padding:20}}>voce não tem endereço cadatrado!</Text>
          <TouchableOpacity style={styles.botonNC} onPress={() => router.push('/address')}>
            <Text style={{padding:8,fontSize:18}}>cadastrar endereço</Text>
          </TouchableOpacity>
        </View>
        ):(
            <View style={stylesp.produtosContainer}>
              {ordens.length === 0 ? (
                <Text style={stylesp.noProductText}>Nenhum venda encontrado.</Text>
              ) : (
                <ScrollView style={{width:330}}>
                {ordens.map((ordem, index) => (
                  <View key={index} style={stylesp.produtoCard}>
                    <Text style={stylesp.produtoName}>produto:{ordem.name_pro}</Text>
                    <TouchableOpacity onPress={() => handleProdutoPress(ordem)}>
                     <View style={stylesp.produtoImageContainer}>
                     <Text style={stylesp.produtbutontext}>Detalhes do produto</Text>
                     </View>
                    </TouchableOpacity>
                    <Text style={{fontSize:18}}>enviar para:</Text>
                    <Text style={stylesp.produtoName}>{ordem.name_cli}</Text>
                    <Text style={stylesp.produtoName}>{ordem.email_cli}</Text><Text/>
                    <Text style={{fontSize:18}}>cep:{ordem.cep_end}</Text>
                    <Text style={{fontSize:18}}>endereço:</Text>
                    <Text style={{fontSize:18}}> {ordem.uf_end},{ordem.cidade},{ordem.rua},{ordem.numero}</Text>
                    <TouchableOpacity onPress={() => enviado(ordem)}>
                     <View style={stylesp.produtoImageContainer}>
                     <Text style={stylesp.produtbutontext}>produto encaminhado</Text>
                     </View>
                    </TouchableOpacity>

                    
                  </View>
                ))}
              </ScrollView>
            )}
            </View>
      )}
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
  },
  botonNp:{
    borderRadius:30,
    backgroundColor:'#eee',
    justifyContent:'center',
    alignItems:'center',
    height:48,
    width:160
  }
});

const stylesp = StyleSheet.create({
  produtosContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  noProductText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  produtoCard: {
    width: 300,
    height:350,
    alignItems:'center',
    marginVertical: 10,
    marginHorizontal:20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  produtoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  produtoDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  produtoQuantity: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  produtoValue: {
    fontSize: 16,
    color: '#0f0',
    marginBottom: 10,
  },
  produtoImageContainer: {
    width: 250,
    height: 50,
    borderRadius:15,
    backgroundColor:'#afa',
    alignItems:'center',
    justifyContent:'center',
    marginTop: 10,
  },
  produtoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeModalButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ff4c4c',
    borderRadius: 10,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalProductDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  modalProductPrice: {
    fontSize: 18,
    color: '#0c0',
    marginBottom: 20,
  },
  modalImagesContainer: {
    marginBottom: 20,
  },
  modalProductImage: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  addToCartButton: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#0f0',
    borderRadius: 20,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 18,
    color: '#fff',
  },
  buyButton: {
    padding: 15,
    backgroundColor: '#0a74da',
    borderRadius: 20,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  produtbutontext: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#0a0',
    marginBottom: 5,
  },
});