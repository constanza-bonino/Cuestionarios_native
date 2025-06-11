import { useEffect, useState } from "react";
import "./PreguntaPage.css";
import { useUser } from "../../context/UserContext";
import { Button } from "react-native-web";

function PreguntaPage() {

    const [pregunta, setPregunta] = useState(null);
    const [respuesta, setRespuesta] = useState(null);
    const [respuestaAnt, setRespuestaAnt] = useState(false);
    const [idResp, setIdResp] = useState("");
    const [lastUpdate, setLastUpdate] = useState("");
    const { getCurrentUser } = useUser()
        ;

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
        // Fetch the product details using async/await
        const fetchQs = async () => {
            try {
                const urlQ = `http://localhost:3000/preguntas/${params.idPregunta}`;
                const resQ = await fetch(urlQ);
                const dataQ = await resQ.json();
                setPregunta(dataQ);
            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        };


        const userId = getCurrentUser().id;
        console.log("user: ", userId);
        const fetchAs = async () => {
            try {
                const urlA = `http://localhost:3000/respuestas/?id_usuario=${userId}&id_pregunta=${params.idPregunta}`;
                const resA = await fetch(urlA);
                const dataA = await resA.json();
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
    }, [params.idCuestionario, params.idPregunta]);

    const cargarJson = async () => {
        const fecha = getCurrentDateTime();
        setLastUpdate(fecha);
        const userId = getCurrentUser().id;
        if (respuestaAnt) {
            try {
                console.log("tiempo", lastUpdate);
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

    const handleChange = (event) => {
        console.log("a:", respuestaAnt);
        setRespuesta(event.target.value);
    };

    // We want to render some loading state if the product is not yet loaded 👇
    if (!pregunta) return <p>Cargando pregunta...</p>;

    // We want to render the product details 👇
    return (
        <View className="pregunta">
            <Text>{pregunta.nombre}</Text>
            {pregunta.opciones ? (
                {pregunta.opciones.map((opcion, idx) => (
                        <label
                            key={idx}
                        >
                            <input
                                type="radio"
                                name="choice"
                                value={opcion}
                                checked={respuesta === opcion}
                                onChange={handleChange}
                            />
                            <span>{opcion}</span>
                        </label>))
                }
            ) : (
                <input
                    type="text"
                    placeholder="Ingrese su respuesta"
                    value={respuesta}
                    onChange={handleChange}
                />
            )}
            <Button onClick={cargarJson}>Guardar respuesta</Button>
            <Text>{lastUpdate}</Text>
        </View>
    );
}

export default PreguntaPage;