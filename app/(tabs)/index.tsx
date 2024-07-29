import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Modal,
  FlatList,
} from 'react-native';;
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
// Placeholder screens for other tabs
function Model(props) {
  const { scene } = useGLTF("../../assets/3d/bmw.glb");
  return <primitive object={scene} {...props} />
}
function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleKalkis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Göndermek istediğiniz veriyi ekleyin (isteğe bağlı)
        // body: JSON.stringify({ key: 'value' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP hatası! Durum: ${response.status}`);
      }

      const data = await response.json();
      console.log('Sunucudan gelen yanıt:', data);
    } catch (error) {
      console.error('İstek gönderilirken bir hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.guvenliAlan}>
        <Text style={styles.modalText}>Güvenli Alan Belirle:</Text>
        <Image
          source={require('../../assets/images/map.png')}
          style={styles.mapImage}
        />
        <TouchableOpacity style={[styles.button, styles.buttonClose]}>
          <Text style={styles.textStyle}>Belirle</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleKalkis} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Yükleniyor...' : 'Kalkış Yap'}</Text>
      </TouchableOpacity>
    </View>
  );
}
function baglantiScreen() {
  const [completionRate, setCompletionRate] = useState(56); 
  useEffect(() => {
    const interval = setInterval(() => {
      setCompletionRate(prevRate => {
        if (prevRate >= 100) {
          clearInterval(interval);
          return 100; 
        } else {
          return prevRate + Math.floor(Math.random() * 5); 
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.baglantiScreen_card}>
        <Text style={styles.baglantiScreen_subtitle}>İHA durumu:</Text>
        <Text style={styles.baglantiScreen_subtitletitle}>Pil Seviyesi: %100</Text>
        <Text style={styles.baglantiScreen_subtitletitle}>Sinyal Gücü: %0</Text>
        <Text style={styles.baglantiScreen_subtitletitle}>Hız ve Yükseklik: 0m/s, 0m</Text>
        <Text style={styles.baglantiScreen_completion}>Tamamlanma Oranı: %0</Text>
      </View>
    </View>
  );
}

function modelScreen() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelList, setModelList] = useState([
    { id: '1', name: 'ev', file: 'model1.glb' },
    // Daha fazla model ekleyebilirsiniz...
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    showModal(); // Model seçildiğinde modalı göster
  };

  const handleUpload = () => {
    if (selectedModel) {
      // Yükleme işlemleri
      console.log(`${selectedModel.name} yükleniyor...`);
    } else {
      console.log('Lütfen bir model seçin!');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const renderModelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleModelSelect(item)}
    >
      <Text style={styles.modelItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>3D MODEL AÇ:</Text>
      <FlatList
        data={modelList}
        renderItem={renderModelItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Text style={styles.text}>3D MODEL YÜKLE:</Text>
      <TouchableOpacity style={styles.buttonmodel} onPress={handleUpload}>
        <Text style={styles.buttonTextmodel}>YÜKLE</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainermodel}>

          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ fov: 45 }}
            style={{ flex: 1 }}
            gl={{ alpha: true }}
          >
            <color attach="background" args={["#101010"]} />
            <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
              <ambientLight intensity={0.5} />
              <directionalLight intensity={1} position={[0, 10, 5]} />
              <mesh>
                <Model scale={0.2} /> 
              </mesh>
            </PresentationControls>
          </Canvas>
          <TouchableOpacity onPress={hideModal} style={styles.closeButtonmodel}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// LogoTitle component
const LogoTitle = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      style={{ width: 70, height: 70, marginLeft: -15 }}
      source={require('../../assets/images/logo.png')}
    />
    <Text style={{ color: '#fff', marginLeft: 1, fontSize: 40, fontFamily: 'Montserrat_400Regular' }}>
      Griffon
    </Text>
  </View>
);

// 3 Nokta Resmi Component
const ThreeDotsIcon = () => (
  <Image
    style={{ marginRight: 15 }}
    source={require('../../assets/images/3nokta.png')}
  />
);
export default function App() {

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator // Top-level navigator olarak Stack.Navigator ekleyin
        screenOptions={{
          headerStyle: {
            backgroundColor: '#241c21', // İstediğiniz header arka plan rengini ayarlayın
          },
          headerTintColor: '#b3b3b3', // Header text rengini ayarlayın
          headerTitle: (props) => <LogoTitle {...props} />, // LogoTitle'ı header olarak kullanın
          headerRight: () => <ThreeDotsIcon />,
        }}
      >
        <Stack.Screen name="Tab" options={{ headerShown: true }}> 
          {() => (
            <Tab.Navigator
            
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'rocket' : 'rocket-outline';
                  } else if (route.name === 'baglanti') {
                    iconName = focused ? 'wifi' : 'wifi-outline';
                  } else if (route.name === 'model') {
                    iconName = focused ? 'eye' : 'eye-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#black',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle:{
                  backgroundColor: '#392c39',
                  borderTopColor: '#241c21',
                },
                
              })}
              tabBarOptions ={{
                showLabel: false, 
              }} 
            >
              <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Tab.Screen name="baglanti" component={baglantiScreen} options={{ headerShown: false }} />
              <Tab.Screen name="model" component={modelScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#241c21',
    fontFamily: 'Montserrat_700Bold'
  },
  button: {
    backgroundColor: '#3d283d',
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  guvenliAlan: {
    margin: 20,
    backgroundColor: '#332833',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 30, // Kalkış Yap butonuna boşluk bırakmak için
  },
  buttonClose: {
    backgroundColor: '#564456',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold'
  },
  modalText: {

    marginBottom: 15,
    textAlign: 'center',
    color:"white",
    fontFamily: 'Montserrat_700Bold',
    fontSize:20,
  },
  mapImage: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius:20,
  },
  /*Sayfa 2*/
  baglantiScreen_card: {
    margin: 20,
    backgroundColor: '#332833',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 30, // Kalkış Yap butonuna boşluk bırakmak için
  },
  baglantiScreen_title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  baglantiScreen_image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius:20,
  },
  baglantiScreen_subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  baglantiScreen_subtitletitle: {
    color: '#FFFFFF',

  },
  baglantiScreen_completion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', 
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
  },
  text: { // <-- EKLENDİ
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    marginTop:20,
  },
  list: { // <-- EKLENDİ
    width: '100%',
    marginBottom: 20,
  },
  modelItem: {
    backgroundColor: '#332833',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modelItemText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonmodel: {
    backgroundColor: '#3d283d',
    padding: 10,
    borderRadius: 5,
    marginBottom:50,
  },
  buttonTextmodel: {
    color: '#fff',
    fontSize: 16,
    
  },
  modalContainermodel: {
    flex: 1,
  },
  closeButton: {
    fontSize: 20,
    padding: 10,
    color: 'white',
  },
  closeButtonmodel: {
    position: 'absolute', // Kapatma düğmesini mutlak konumlandırma
    top: 20, // Üstten 20 birim uzaklıkta
    right: 20, // Sağdan 20 birim uzaklıkta
    padding: 10,
    backgroundColor: '#d4b6b5', // Yarı saydam siyah arka plan
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});