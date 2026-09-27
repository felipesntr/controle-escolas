
import { useRouter } from 'expo-router';
import { Button } from 'expo-router/build/react-navigation';
import { View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View>
        // botao q leva para escolas
      <Button onPress={() => router.push({
        pathname: "/schools/index",
      })}>
        Ver Escolas
      </Button>
    </View>
  );
}