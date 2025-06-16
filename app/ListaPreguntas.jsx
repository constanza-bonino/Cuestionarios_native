import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Link, Text, View } from "react-native";

function ListaPreguntasPage() {
    const { idCuestionario } = useLocalSearchParams();

    const [cuestionario, setCuestionario] = useState(null);
    const [preguntas, setPreguntas] = useState(null);

    useEffect(() => {
        // Fetch the product details using async/await
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

    // We want to render some loading state if the product is not yet loaded 👇
    if (!preguntas || !cuestionario) return <p>Cargando preguntas...</p>;
    console.log("Preguntas: ", preguntas);
    // We want to render the product details 👇
    return (<View className="preguntas">
        <Text>{cuestionario.nombre}</Text>
        {
            preguntas.map((pregunta) => {
                console.log(pregunta); return (
                    <Link key={"c" + idCuestionario + "p" + pregunta.id} href={{
                        pathname: '/cuestionarios/[preguntaId]',
                        params: {
                            preguntaId: pregunta.id
                        }
                    }}> {pregunta.nombre} </Link>
                )
            })
        }
        {/* <Link href={{ }
                        pathname: '/cuestionarios/[idCuestionario]/crearPregunta',
                        params: {
                            idCuestionario: idCuestionario
                        }
                    }}> Crear nueva pregunta </Link>*/}
    </View>
    );
}

export default ListaPreguntasPage;