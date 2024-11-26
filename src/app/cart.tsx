import React, { useEffect, useState } from 'react';
import { useRouter,useGlobalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, FlatList, Alert,Modal, Text, TouchableOpacity, View, Image, Button, TextInput } from 'react-native';
import { useUserDatabase } from '@/database/useUserDatabase';
import { readConfigFile } from '@/app/login';
import { update } from 'lodash';

type Item = {
  id: number;
  produto: number;
  name: string;
  value: number;
  quantity: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [url, setUrl] = useState<string>('');
  const [tokey, setTokey] = useState<string>('');
  const [totalValue, setTotalValue] = useState<number>(0); 
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const UserDatabase = useUserDatabase();
  const router = useRouter();
  const { chave } = useGlobalSearchParams()
  
  useEffect(() => {
    const fetchConfigUrl = async () => {
      const configUrl = await readConfigFile();
    setUrl(configUrl);
    };
    fetchConfigUrl();
  }, []);

  useEffect(() => {
    if (url && tokey) {
      fetchCartItems();
      console.log(chave)
      if (chave){
        setModalVisible(true)
      }
    }
  }, [url, tokey]);

  useEffect(() => {
    calculateTotal(); 
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const formData = { tokey };

      const uploadResponse = await fetch(url + 'getcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json: Item[] = await uploadResponse.json();

      if (uploadResponse.ok) {
        if (json) {
          setCartItems(json); // Atualiza o estado com os itens do carrinho
        } else {
          console.log('sem itens');
        }
      } else {
        console.error('Erro ao obter itens:', json);
        Alert.alert('Erro', 'Erro ao carregar itens.');
      }
    } catch (error) {
      console.error('Erro ao conectar cart:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };

  const handleQuantityChange = (id: number, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    } else {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: 0 } : item
          ));
    }
  };

  const handleBlur = (id: number, quantity: string) => {
    const updatedQuantity = parseInt(quantity);
    if (!isNaN(updatedQuantity) && updatedQuantity > 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: updatedQuantity } : item
      ));
      updatecart(id,updatedQuantity)
    } else {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: 1 } : item
        ));
        updatecart(id,1)
    }
    
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + item.value * item.quantity, 0);
    setTotalValue(total);
  };

  const updatecart = async (id:number,quantity:number)=>{ 
    
    try {
        const formData = { tokey,id,quantity };
  
        const uploadResponse = await fetch(url + 'editcart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const json: Item[] = await uploadResponse.json();
  
        if (uploadResponse.ok) {
          console.log('atualizado');
        
        } else {
          console.error('Erro ao deletar:', json);
        }
      } catch (error) {
        console.error('Erro ao conectar cart:', error);
        Alert.alert('Erro', 'Erro ao conectar ao servidor.');
      }

  
    }

  const removecart = async(id:number)=>{  
    
    try {
        const formData = { tokey,id };
  
        const uploadResponse = await fetch(url + 'removecart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const json: Item[] = await uploadResponse.json();
  
        if (uploadResponse.ok) {
          console.log('deletado');
        
        } else {
          console.error('Erro ao deletar:', json);
        }
      } catch (error) {
        console.error('Erro ao conectar cart:', error);
        Alert.alert('Erro', 'Erro ao conectar ao servidor.');
      }
    
  }

  const fim =()=>{
router.push({
    pathname: '/card',
    params: { chave:'card' },
});
    setModalVisible(true)
  }

  const ordem =()=>{
    
  }
  const renderCartItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>R$ {item.value.toFixed(2)}</Text>

      <Text style={styles.quantityLabel}>Quantidade:</Text>

      <TextInput
        style={styles.quantityInput}
        keyboardType="numeric"
        value={String(item.quantity)}
        onChangeText={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
        onBlur={() => handleBlur(item.id, String(item.quantity))}
      />

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          removecart(item.id)
          setCartItems(cartItems.filter(i => i.id !== item.id));
        }}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  const perfil = async () => {
    const response = await UserDatabase.serchByuse(1);
    if (response && response.length > 0) {
      setTokey(String(response[0]['tokey']));
    }
  };

  useEffect(() => {
    perfil(); 
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbox}>
        <View style={styles.iconbox}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image style={styles.image} source={require('../assets/4.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => String(item.id)}  
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.nce}>
            <Text style={styles.emptyMessage}>Seu carrinho está vazio</Text>
          </View>
        }
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R$ {totalValue.toFixed(2)}</Text>
      </View>
      {cartItems.length > 0 && (
        <Button title="Finalizar Compra" onPress={()=>fim()}/>)}
        
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Resumo da Compra</Text>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.modalItem}>
                  <Text>{item.quantity}   {item.name} de R$ {item.value.toFixed(2)}</Text>
              
                </View>
              )}
            />
            <Text>enviar para:</Text>
            <Text>{chave}</Text>
            <Text style={styles.modalTotalText}>Total: R$ {totalValue.toFixed(2)}</Text>
            <View style={{flexDirection:'row'}}>
              
            <View style={{padding:4}}>
            <Button title="Confirmar" onPress={() => {
              setModalVisible(false);
              // Proceed with checkout process here...
            }}  /></View>
            <View style={{padding:4}}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#0f0',
  },
  quantityLabel: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  quantityInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 5,
    width: '60%',
    borderRadius: 5,
  },
  emptyMessage: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  nce: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  totalContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Cart;
