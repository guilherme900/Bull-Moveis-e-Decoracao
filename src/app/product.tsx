import {Link} from "expo-router"
import React, {useState,useEffect} from 'react';
import {SafeAreaView,StyleSheet,View,ScrollView,Text,Image,TouchableOpacity,Modal,BackHandler,TextInput} from 'react-native';
import { Card } from 'react-native-paper';


export default function Index(){
    const [produto, setproduto] = useState(false); 
    const [produto1, setproduto1] = useState(false); 
    const [produto2, setproduto2] = useState(false); 
    const [produto3, setproduto3] = useState(false); 
    const [produto4, setproduto4] = useState(false); 
    const [produto5, setproduto5] = useState(false); 
    const [produto6, setproduto6] = useState(false); 
    const [produto7, setproduto7] = useState(false); 
    const [produto8, setproduto8] = useState(false); 
    return(<View>
    <Modal visible={produto}>
    <TouchableOpacity style={{width:'100%',height:100,flexDirection:'column-reverse',backgroundColor:'#10d010'}} onPress={()=>{setproduto(false)}}>
    <Image style={styles.image} source={require('../assets/4.png')}/>
    </TouchableOpacity>
    <Text style={styles.boxtext}>Poltrona Julia Cinza e Nogueira</Text>
    <Text style={styles.textvalor}>R$548,67</Text>
    <View>
    <ScrollView horizontal={true}>
    <Image style={styles.imageproduto} source={require('../assets/produtos/1.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/12.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/13.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/14.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/15.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/16.jpg')}/>
    </ScrollView>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{margin:10,width:100,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>comprar</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{width:200,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>adicoinar ao carrinha</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
    <Modal visible={produto1}>
    <TouchableOpacity style={{width:'100%',height:100,flexDirection:'column-reverse',backgroundColor:'#10d010'}} onPress={()=>{setproduto1(false)}}>
    <Image style={styles.image} source={require('../assets/4.png')}/>
    </TouchableOpacity>
    <Text style={styles.boxtext}>Sofá 3 Lugares Beny Base de Madeira Linho Cotton Cru</Text>
    <Text style={styles.textvalor}>R$1.449,84</Text>
    <View>
    <ScrollView horizontal={true}>
    <Image style={styles.imageproduto} source={require('../assets/produtos/2.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/22.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/23.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/24.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/25.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/26.jpg')}/>
    </ScrollView>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{margin:10,width:100,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>comprar</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{width:200,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>adicoinar ao carrinha</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
    <Modal visible={produto2}>
    <TouchableOpacity style={{width:'100%',height:100,flexDirection:'column-reverse',backgroundColor:'#10d010'}} onPress={()=>{setproduto2(false)}}>
    <Image style={styles.image} source={require('../assets/4.png')}/>
    </TouchableOpacity>
    <Text style={styles.boxtext}>Rack Treviso Preto 180 cm</Text>
    <Text style={styles.textvalor}>R$428,67</Text>
    <View>
    <ScrollView horizontal={true}>
    <Image style={styles.imageproduto} source={require('../assets/produtos/3.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/32.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/33.jpg')}/>
    </ScrollView>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{margin:10,width:100,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>comprar</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{width:200,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>adicoinar ao carrinha</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
    <Modal visible={produto3}>
    <TouchableOpacity style={{width:'100%',height:100,flexDirection:'column-reverse',backgroundColor:'#10d010'}} onPress={()=>{setproduto3(false)}}>
    <Image style={styles.image} source={require('../assets/4.png')}/>
    </TouchableOpacity>
    <Text style={styles.boxtext}>Cama Box Casal + Colchão D33 One Face - 56x138x188cm - Suede Preto</Text>
    <Text style={styles.textvalor}>R$698,97</Text>
    <View>
    <ScrollView horizontal={true}>
    <Image style={styles.imageproduto} source={require('../assets/produtos/4.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/42.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/43.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/44.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/45.jpg')}/>
    </ScrollView>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{margin:10,width:100,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>comprar</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{width:200,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>adicoinar ao carrinha</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
    <Modal visible={produto4}>
    <TouchableOpacity style={{width:'100%',height:100,flexDirection:'column-reverse',backgroundColor:'#10d010'}} onPress={()=>{setproduto4(false)}}>
    <Image style={styles.image} source={require('../assets/4.png')}/>
    </TouchableOpacity>
    <Text style={styles.boxtext}>Guarda-Roupa Casal Attore 4 PT 3 GV Amendola e Grafito</Text>
    <Text style={styles.textvalor}>R$1.258,67</Text>
    <View>
    <ScrollView horizontal={true}>
    <Image style={styles.imageproduto} source={require('../assets/produtos/5.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/52.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/53.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/54.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/55.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/56.jpg')}/>
    </ScrollView>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{margin:10,width:100,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>comprar</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{width:200,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>adicoinar ao carrinha</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
    <Modal visible={produto5}>
    <TouchableOpacity style={{width:'100%',height:100,flexDirection:'column-reverse',backgroundColor:'#10d010'}} onPress={()=>{setproduto5(false)}}>
    <Image style={styles.image} source={require('../assets/4.png')}/>
    </TouchableOpacity>
    <Text style={styles.boxtext}>Cômoda Austin 10Gv Branco</Text>
    <Text style={styles.textvalor}>R$418,36</Text>
    <View>
    <ScrollView horizontal={true}>
    <Image style={styles.imageproduto} source={require('../assets/produtos/6.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/62.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/63.jpg')}/>
    <Image style={styles.imageproduto} source={require('../assets/produtos/64.jpg')}/>
    </ScrollView>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{margin:10,width:100,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>comprar</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:'100%',alignItems:'center'}}>
    <TouchableOpacity style={{width:200,borderRadius:20,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#0f0'}}>
    <Text style={styles.boxtext}>adicoinar ao carrinha</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal></View>
    )}


const styles = StyleSheet.create({
  container: {
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
    justifyContent:'space-between',
    flexDirection:'row',
  },
  iconperfil:{
    height:60,
    width:60,
    borderRadius:50,
    backgroundColor: '#ffff00',
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
  }
});

