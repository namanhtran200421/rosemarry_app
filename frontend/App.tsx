import { Button, StyleSheet, Text, View } from 'react-native';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

function HomeScreen() {
  const { authorize, clearSession, user, isLoading } = useAuth0();

const handleLogin = async () => {
  try {
    await authorize(
      {
        connection: 'email',
        scope: 'openid profile email',
      },
      {
        customScheme: 'rosemarry',
      }
    );
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const handleLogout = async () => {
  try {
    await clearSession(
      {},
      {
        customScheme: 'rosemarry',
      }
    );
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Logged in as:</Text>
          <Text>{user.email}</Text>

          <Button title="Log out" onPress={handleLogout} />
        </>
      ) : (
        <Button title="Log in" onPress={handleLogin} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <Auth0Provider
      domain={process.env.EXPO_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!}
    >
      <HomeScreen />
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});