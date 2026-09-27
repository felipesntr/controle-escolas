import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Pressable,
    Text,
    View,
} from "react-native";

export default function SchoolPage() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    const router = useRouter();

    return (
        <View>
            <Text>Escola {schoolId}</Text>

            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/schools/[schoolId]/classes/index",
                        params: {
                            schoolId,
                        },
                    })
                }
            >
                <Text>Turmas</Text>
            </Pressable>
        </View>
    );
}