import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

function Cuestionarios() {
    const [cuestionarios, setCuestionarios] = useState(null);

    useEffect(() => {
        // Fetch the product details using async/await
        const fetchQs = async () => {
            try {
                const url = `http://localhost:3000/cuestionarios`;
                const res = await fetch(url);
                const data = await res.json();
                setCuestionarios(data);
            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        };

        fetchQs();
    }, []);

    if (!cuestionarios) return <p>Cargando cuestionarios...</p>;
    console.log(cuestionarios);

    return (
        <View style={styles.cuestionarios}>
            <h1>Cuestionarios</h1>
            {cuestionarios.map((cuestionario) => (
                <Link
                    style={styles.link}
                    key={"cuestionario" + cuestionario.id}
                    href={`/cuestionarios/params?id=${cuestionario.id}`}
                >
                    {" "}
                    <span style={styles.titulo}>
                        {cuestionario.nombre}
                    </span>: {cuestionario.descripcion}
                </Link>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    cuestionarios: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
    },

    link: {
        color: "palevioletred",
    },
    titulo: {
        textDecoration: "underline",
    },
});

export default Cuestionarios;
