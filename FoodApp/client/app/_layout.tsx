import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle:"", headerShown:false
      }}/>
      <Stack.Screen name="selectauth" options={{
        headerTitle:"", headerShown:false
      }}/>
      <Stack.Screen name="autentificareutilizator" options={{
        headerTitle:"", headerShown:false, headerBackVisible:false
      }}/>
      <Stack.Screen name="login" options={{
        headerTitle:"", headerBackVisible:false, headerShown: false
      }}/>  

      <Stack.Screen name="mainpage" options={{
        headerTitle:"Bun venit", headerBackVisible:false, headerShown:false
      }}/>

    <Stack.Screen name="payment" options={{
        headerTitle:"Checkout", headerBackVisible:false, headerShown:false
      }}/>
    </Stack>
  );
}
