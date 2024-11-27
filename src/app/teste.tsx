import {useEffect, useState} from "react"
import {SafeAreaView,Image,Text,Button, Alert,FlatList,Pressable ,PressableProps} from "react-native"
import{Link} from "expo-router"
import * as ImagePicker from 'expo-image-picker';
import {readConfigFile} from '@/app/login';

import {useUserDatabase, UserDatabase} from "@/database/useUserDatabase"

type Props = PressableProps&{
    data:{    
        tokey:string
        use: number
        name:string
        vendedor:number
    }
}
export function Product({data, ...rest}:Props){
    return <Pressable style={{
        backgroundColor:"#cecece",
        padding:24,borderRadius:5,
        gap:12,
        flexDirection:"row"
        }}
         {...rest}>
        <Text>
            {data.tokey}-{data.use} -{data.name}-{data.vendedor}
        </Text>
    </Pressable>
}

export default function Home(){
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [iduser, setiduser] = useState("")
    const [search, setSearch] = useState(0)
    const tokey="f40b9c945c4f80ac2ef31d9954a8852c2315b7597d287b1f9a4c4d3c349b7f11"
    const [quantity,setQuantity] = useState("")
    const [image, setImage] = useState<string | null>(null);
    const [products,setProducts] = useState<UserDatabase[]>([])    
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
      const fetchConfigUrl = async () => {
        const configUrl = await readConfigFile();
        setUrl(configUrl);
      };
      fetchConfigUrl();
    },[]);
    
    const productDatabase = useUserDatabase()


    async function update(){
        try {
            await productDatabase.update(String(id))
        } catch (error) {
            console.log(error)
            
        }
    }
    async function delet() {
        try {
            await productDatabase.delet(String(id))
        } catch (error) {
            console.log(error)
        }
        setId("")
        setName("")
        setiduser("")
        setQuantity("")
        await list()
    }
    async function list() {
        try {
            const response = await productDatabase.serchByuse(Number(search))
            setProducts(response || [])
        } catch (error) {
            console.log(error)
            
        }    
    }
    async function textb() {
        try {
            const response = await productDatabase. serchByTokey(tokey)
        } catch (error) {
            console.log(error)
            
        }    
    }
    

    function details(item:UserDatabase){
        setId(String(item.tokey))
        setName(item.name)
    }
    async function handleSave() {
        if(id){
            update()
        }
        setId("")
        await list()
        
    }
    useEffect(()=> {
        list()
    })
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
    console.log(result)
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    }

    return( 
    <SafeAreaView style={{flex:1,justifyContent:"center",padding:32}}>
       <Text style={{fontSize:20}}>{id}  -  {name}  -  {quantity}  -  </Text> 
       <Button title="apagar" onPress={delet}/>
       <Button title="update" onPress={update}/>
       <FlatList
       data={products}
       keyExtractor={(item) => String(item.tokey)}
       renderItem={({item}) => <Product data={item} onPress={() =>details(item)}/>}
       contentContainerStyle={{gap:16}}
       />

       <Text style={{fontSize:18}}>url do servidor:   {url}</Text>
       <Text></Text>
       <Link href="/">
            <Text style={{fontSize:18}}>
                teste
            </Text>
        </Link>
       <Link href="/register">
            <Text style={{fontSize:18}}>
                teste re
            </Text>
        </Link>
       <Link href="/login">
            <Text style={{fontSize:18}}>
                teste lo
            </Text>
        </Link>
        <Link href="/getImagem">
            <Text style={{fontSize:18}}>
                teste ima
            </Text>
        </Link>
    
      <Button title="Escolha uma imagem do rolo da câmera" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{width: 200,height: 200,}} />}
    
    </SafeAreaView>
    )
}
