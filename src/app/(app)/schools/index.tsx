import { useRouter } from "expo-router";
import {
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

const schools = [
    {
        id: "1",
        name: "Escola Municipal João Silva",
    },
    {
        id: "2",
        name: "Escola Municipal Maria Santos",
    },
];

export default function SchoolsPage() {
    const router = useRouter();

    return (
        <View>
            <Pressable onPress={() => router.push("/schools/new")}>
                <Text>+ Nova escola</Text>
            </Pressable>

            <FlatList
                data={schools}
                keyExtractor={(school) => school.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/schools/[schoolId]/index",
                                params: {
                                    schoolId: item.id,
                                },
                            })
                        }
                    >
                        <Text>{item.name}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}