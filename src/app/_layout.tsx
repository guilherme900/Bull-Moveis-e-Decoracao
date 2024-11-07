import { useState, useEffect } from 'react';
import { SQLiteProvider } from "expo-sqlite";
import { Slot } from "expo-router";
import LoadingScreen from '@/components/LoadingScreen';
import { initilizeDatabase } from "@/database/initializeDatabase";
import * as FileSystem from 'expo-file-system';

const configDir = `${FileSystem.documentDirectory}configUrl`;

async function createOrUpdateConfigFile(url:string) {
  try {
    await FileSystem.makeDirectoryAsync(configDir, { intermediates: true });
    const configFilePath = `${configDir}/config.json`;
    const configContent = JSON.stringify({ url: url });
    await FileSystem.writeAsStringAsync(configFilePath, configContent);
  } catch (error) {
    console.error('Erro ao criar ou modificar o arquivo de configuração:', error);
  }
}
export default function Layout() {
const [loading, setLoading] = useState<boolean>(true);
  const getUrl = async () => {
    try {
      const response = await fetch('https://guilherme900.github.io/severid/', {
        method: 'GET',
        headers: { 'Accept': 'text/html' },
        cache: 'no-cache',
      }); 
      const html = await response.text();
      await createOrUpdateConfigFile(html);
    setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Erro:', error);
    }
  };

  useEffect(() => {  
    const fetchData = async () => {
    try {
      await getUrl();
    } catch (error) {
      console.error('Erro ao carregar URL:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  }, []);

  if(loading)return<LoadingScreen/>

  return (
    <SQLiteProvider databaseName="sqlite.db" onInit={initilizeDatabase}>
      <Slot />
    </SQLiteProvider>
  );
}
