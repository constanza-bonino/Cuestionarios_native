import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { UserProvider } from '../context/UserContext';


export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="Pregunta"
          options={{
            title: 'Pregunta',
            headerTitleStyle: {
              fontFamily: 'SpaceMono',
              fontSize: 24,
            },
          }} />
        <Stack.Screen
          name="ListaPreguntas"
          options={{
            title: 'Lista de Preguntas',
            headerTitleStyle: {
              fontFamily: 'SpaceMono',
              fontSize: 24,
            },
          }} />
      </Stack>
    </UserProvider>
  );
}
