
import CustomJobHeader from '@/components/CustomJobHeader';
import CustomPaymentHeader from '@/components/CustomPaymentHeader';
import SecCustomHeader from '@/components/secCustomHeader'
import { AntDesign } from "@expo/vector-icons";
import { Stack, useNavigation, useRouter } from "expo-router"
import { View } from 'react-native';

const StackLayout = () => {
    const navigation = useNavigation();
    const router = useRouter();
    return (
        <Stack 
        screenOptions={{
            // header: () => <SecCustomHeader title="" />,
            // headerShown: false
        }}>
            <Stack.Screen name="index"
            options={{
                header: () => <CustomJobHeader title="Posted Jobs" />,
            }}
            />
            <Stack.Screen name="add"
            options={{
                header: () => <CustomPaymentHeader title="Add Job"/>
            }}
            />
            <Stack.Screen name="payment"
            options={{
                header: () => <CustomPaymentHeader title='Payments'/>
            }}
            />
            <Stack.Screen name="search-contact"
            options={{
                header: () => <CustomJobHeader title="Search Connects" />,
            }}
            />
        </Stack>
    )
}

export default StackLayout;