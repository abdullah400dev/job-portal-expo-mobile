import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Register your app in Google Cloud Console and get these credentials
const GOOGLE_CLIENT_ID = '541381490206-vtjin1cic6g814beo8m63e58auq0pqg6.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '541381490206-vtjin1cic6g814beo8m63e58auq0pqg6.apps.googleusercontent.com';
const IOS_CLIENT_ID = '541381490206-6clnjqf9rgilo688u450lqpjbpgqrdlf.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
  });

  const handleSignIn = async () => {
    try {
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;
        
        // Get user info using the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${authentication?.accessToken}` },
          }
        );

        const userInfo = await userInfoResponse.json();
        
        // Store user info and tokens
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        await AsyncStorage.setItem('tokens', JSON.stringify(authentication));
        
        // Navigate to the appropriate screen
        router.replace('/(tabs)');
        
        return { success: true, data: userInfo };
      }
      
      return { success: false, error: 'Sign in was canceled or failed' };
    } catch (error) {
      console.error('Google Sign In Error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  return {
    handleSignIn,
    isLoading: !request,
  };
};
