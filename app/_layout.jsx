import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { UserProvider } from "../contexts/UserContext";


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
        <Stack.Screen name="index" options={{ title: 'Cuestionario' }}/>
        <Stack.Screen name="CuestionariosPage" options={{ title: 'Cuestionarios' }}/>
        <Stack.Screen name="preguntas" options={{ title: 'Preguntas' }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
        <Toast />
    </UserProvider>
  );
}
