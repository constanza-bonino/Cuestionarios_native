import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

function ListaPreguntas() {
    const { idCuestionario } = useLocalSearchParams();

    const [cuestionario, setCuestionario] = useState(null);
    const [preguntas, setPreguntas] = useState(null);

    useEffect(() => {
        const fetchQs = async () => {
            try {
                const urlQ = `http://localhost:3000/preguntas/?id_cuestionario=${idCuestionario}`;
                const resQ = await fetch(urlQ);
                const dataQ = await resQ.json();
                setPreguntas(dataQ);
            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        };

        const fetchDataCuestionario = async () => {
            try {
                const url = `http://localhost:3000/cuestionarios/${idCuestionario}`;
                const res = await fetch(url);
                const data = await res.json();
                setCuestionario(data);
            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        }

        fetchQs();
        fetchDataCuestionario();
    }, [idCuestionario]);

    if (!preguntas || !cuestionario) return <Text>Cargando preguntas...</Text>;
    console.log("Preguntas: ", preguntas);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{cuestionario.nombre}</Text>
            {preguntas.map((pregunta, index) => (
                <Link
                    key={"c" + idCuestionario + "p" + pregunta.id}
                    href={{
                        pathname: '/Pregunta',
                        params: {
                            id: pregunta.id
                        }
                    }}
                    asChild
                >
                    <TouchableOpacity 
                        style={[styles.questionItem, 
                            { backgroundColor: getQuestionColor(index) || '#F8FAFC' }]}
                        activeOpacity={0.7}
                    >
                        <View style={styles.questionNumber}>
                            <Text style={styles.questionNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.questionContent}>
                            <Text style={styles.questionText}>{pregunta.nombre}</Text>
                            <Text style={styles.questionSubtext}>Toca para responder</Text>
                        </View>
                        <View style={styles.arrow}>
                            <Text style={styles.arrowText}>-</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            ))}
        </View>
    );
}

const getQuestionColor = (index) => {
    const colors = [
        '#E8F4FD', 
        '#F0F9E8', 
        '#FFF2E8', 
        '#F8E8FF', 
        '#FFE8F0', 
    ];
    console.log("color", colors[index % colors.length] );
    return colors[index % colors.length];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
    },
    spinner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#E2E8F0',
        borderTopColor: '#3B82F6',
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    header: {
        padding: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 12,
        lineHeight: 32,
    },
    badge: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    questionsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    questionNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    questionNumberText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    questionContent: {
        flex: 1,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
        lineHeight: 20,
    },
    questionSubtext: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    arrow: {
        marginLeft: 12,
    },
    arrowText: {
        fontSize: 24,
        color: '#94A3B8',
        fontWeight: '300',
    },
});


export default ListaPreguntas;