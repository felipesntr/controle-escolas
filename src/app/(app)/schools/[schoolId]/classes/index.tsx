import { useLocalSearchParams, useRouter } from "expo-router";
import {
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

const classes = [
    {
        id: "1",
        name: "6º Ano A",
    },
    {
        id: "2",
        name: "6º Ano B",
    },
    {
        id: "3",
        name: "7º Ano A",
    },
];

export default function ClassesPage() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    const router = useRouter();

    return (
        <View>
            <Text>Escola: {schoolId}</Text>

            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/schools/[schoolId]/classes/new",
                        params: {
                            schoolId,
                        },
                    })
                }
            >
                <Text>+ Nova turma</Text>
            </Pressable>

            <FlatList
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
}