import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Button, Touchable, TouchableOpacity, TextInput } from "react-native";

import Toast from "react-native-toast-message";


function PreguntaPage() {

    const [pregunta, setPregunta] = useState(null); 
    const [respuesta, setRespuesta] = useState(null);
    const [respuestaAnt, setRespuestaAnt] = useState(false);
    const [idResp, setIdResp] = useState("");
    const [lastUpdate, setLastUpdate] = useState("");
    const { getCurrentUser } = useUser();
    
    const { id } = useLocalSearchParams();
    const showToast = (message) => {
            Toast.show({
                type: "error",
                text1: message,
                visibilityTime: 2500
            });
        };

    function getCurrentDateTime() {
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "     "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        return datetime
    }

    useEffect(() => {
        const fetchQs = async () => {
            try {
                const urlQ = `http://localhost:3000/preguntas/${id}`;
                const resQ = await fetch(urlQ);
                const dataQ = await resQ.json();
                setPregunta(dataQ);
            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        };

        const userId = getCurrentUser().id;
        const fetchAs = async () => {
            try {
                const urlA = `http://localhost:3000/respuestas/?id_usuario=${userId}&id_pregunta=${id}`;
                const resA = await fetch(urlA);
                const dataA = await resA.json();
                console.log("DATA RESPUESTA", dataA);
                if (dataA[0]) {
                    setRespuestaAnt(true);
                    setRespuesta(dataA[0].valor);
                    setIdResp(dataA[0].id)
                    setLastUpdate(dataA[0].fechaHora)
                }
            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        };

        fetchQs();
        fetchAs();
    }, [id]);

    const checkeoDatos = () => {
        if (!respuesta) {
            showToast(`Ingrese una respuesta`);
            return;
        }
        cargarJson();
    };

    const cargarJson = async () => {
        const fecha = getCurrentDateTime();
        setLastUpdate(fecha);
        const userId = getCurrentUser().id;
        if (respuestaAnt) {
            try {
                const res = await fetch(`http://localhost:3000/respuestas/${idResp}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        valor: respuesta,
                        fechaHora: fecha
                    })
                });
                if (!res.ok) throw new Error("Error al agregar patch");
                return await res.json();
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const res = await fetch("http://localhost:3000/respuestas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_usuario: userId,
                        id_pregunta: pregunta.id,
                        valor: respuesta,
                        fechaHora: fecha
                    })
                });
                if (!res.ok) throw new Error("Error al agregar post");
                const responseData = await res.json();
                setIdResp(responseData.id);
                setRespuestaAnt(true);
                return responseData;
            } catch (err) {
                console.error(err);
            }
        }
    };


    // We want to render some loading state if the product is not yet loaded 👇
    if (!pregunta) return <p>Cargando pregunta...</p>;

    // We want to render the product details 👇
    return (
        <View className="pregunta">
            <Text>{pregunta.nombre}</Text>
            {pregunta.opciones ? (
                <>
                    {pregunta.opciones.map((opcion, idx) => (
                        <TouchableOpacity key={idx} className="opcion" onPress={() => setRespuesta(opcion)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, padding: 10, borderRadius: 5, backgroundColor: 'lightgray' }}
                        >
                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: respuesta === opcion ? 'magenta' : 'gray', marginRight: 10 }} />
                            <Text>{opcion}</Text>
                        </TouchableOpacity>))
                    }
                </>
            ) : (
                <TextInput
                    type="text"
                    placeholder="Ingrese su respuesta"
                    defaultValue={respuesta}
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 5, borderRadius: 5, marginVertical: 10, backgroundColor: 'white' }}
                onChangeText={(text) => setRespuesta(text)}
                />
            )}
            <TouchableOpacity onPress={checkeoDatos}> Cargar Respuesta </TouchableOpacity>
            <Text>{lastUpdate}</Text>
        </View>
    );
}

export default PreguntaPage;