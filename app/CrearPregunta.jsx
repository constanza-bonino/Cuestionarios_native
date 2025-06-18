import React from "react";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CrearPregunta() {

    const { idCuestionario } = useLocalSearchParams();

    const [nombre, setNombre] = useState("");
    const [type, setType] = useState(null);
    const [opciones, setOpciones] = useState([]);
    const [completo, setCompleto] = useState(false);

    const handleMOSelector = (event) => {
        setType("MO")
    };

    const handleTextSelector = (event) => {
        setType("text")
    };

    const handleInputChange = (event) => {
        let index = parseInt(event.target.id);
        let value = event.target.value;
        if (value.trim !== "") {
            let array = opciones;
            array[index] = value;
            setOpciones(array);
        }

        let flag = true;

        opciones.map((opcion) => {
            flag = flag && (opcion.trim() !== "")
        })

        setCompleto(flag);

    };

    const isButtonDisabled = (type !== "MO" || completo) && (nombre.trim() !== "");


    const cargarJson = async () => {
        if (type === "MO") {
            try {
                const res = await fetch("http://localhost:3000/preguntas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_cuestionario: idCuestionario,
                        opciones: [
                            opciones[0],
                            opciones[1],
                            opciones[2]
                        ],
                        nombre: nombre
                    })
                });
                if (!res.ok) throw new Error("Error al agregar post");
                const responseData = await res.json();
                return responseData;
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const res = await fetch("http://localhost:3000/preguntas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_cuestionario: idCuestionario,
                        nombre: nombre
                    })
                });
                if (!res.ok) throw new Error("Error al agregar post");
                const responseData = await res.json();
                return responseData;
            } catch (err) {
                console.error(err);
            }
        }

    };

    // We want to render the product details 👇
    return (
        <View className="pregunta">
            <Text>Crea tu pregunta:</Text>
            <TextInput
                type="text"
                placeholder="Ingrese el nombre de la pregunta"
                onChangeText={(text) => setNombre(text)}
                style={styles.input}
            />
            <Text>Seleccione el tipo de pregunta:</Text>
            <TouchableOpacity key="MO" className="tipo" onPress={handleMOSelector} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, padding: 10, borderRadius: 5, backgroundColor: 'lightgray' }}
            >
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: type === "MO" ? 'magenta' : 'gray', marginRight: 10 }} />
                <Text>MO</Text>
            </TouchableOpacity>
            <TouchableOpacity key="texto" className="tipo" onPress={handleTextSelector} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, padding: 10, borderRadius: 5, backgroundColor: 'lightgray' }}
            >
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: type === "text" ? 'magenta' : 'gray', marginRight: 10 }} />
                <Text>Texto</Text>
            </TouchableOpacity>
            {type === "MO" && (
                <>
                    <Text for="op1">Opción uno:</Text>
                    <TextInput type="text" id="0" onChange={handleInputChange} style={styles.input}></TextInput>
                    <Text for="op2">Opción dos:</Text>
                    <TextInput type="text" id="1" name="fname" onChange={handleInputChange} style={styles.input}></TextInput>
                    <Text for="op3">Opción tres:</Text>
                    <TextInput type="text" id="2" onChange={handleInputChange} style={styles.input}></TextInput>
                </>
            )}
            <TouchableOpacity onClick={cargarJson} disabled={isButtonDisabled}>Guardar pregunta</TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: 'white'
    }
});

