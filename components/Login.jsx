import { router } from "expo-router";
import { useRef } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useUser } from "../context/UserContext";

function Login() {
    const usuarioActual = useRef(null);
    const { setCurrentUser } = useUser();

    const showToast = (message) => {
        Toast.show({
            type: "success",
            text1: message,
        });
    };

    const fetchUsuario = async (nombre) => {
        try {
            const url = `http://localhost:3000/usuarios/?nombre=${nombre}`;
            console.log(url);
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            return data ? data[0] : undefined;
        } catch (err) {
            console.error("Failed to fetch:", err);
        }
    };

    const crearUsuario = async (nombre) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombre }),
        };
        const response = await fetch(
            "http://localhost:3000/usuarios/",
            requestOptions
        );
        const data = await response.json();
        return data;
    };

    const logIn = async (e) => {
        e.preventDefault();
        if (usuarioActual.current.value.trim() !== "") {
            let user = await fetchUsuario(usuarioActual.current.value);
			showToast(`Bienvenido de nuevo ${usuarioActual.current.value}`);
            if (!user) {
				user = await crearUsuario(usuarioActual.current.value);
				showToast(`Usuario creado: ${usuarioActual.current.value}`);
            }
            // setUsuario(user);
            setCurrentUser(user);
            router.navigate("/CuestionariosPage");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginCard}>
                <Text style={styles.text}>Log In</Text>
                <Text style={{ marginHorizontal: "3%", marginTop: "5%" }}>
                    Username
                </Text>
                <TextInput
                    title="username"
                    style={styles.input}
                    // value={username}
                    ref={usuarioActual}
                    placeholder="Username"
                />
                <TouchableOpacity style={styles.loginBtn} onPress={logIn}>
                    <Text style={styles.btnText}>Ingresar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginBtn} onPress={() => setCurrentUser(null)}>
                    <Text style={styles.btnText}>cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    loginCard: {
        borderColor: "#EDC79B",
        backgroundColor: "#EDC79B88",
        borderRadius: 20,
        borderWidth: 4,
        minWidth: 200,
        width: "40%",
    },
    inputTitle: {
        marginHorizontal: "3%",
    },
    text: {
        fontSize: 40,
        fontWeight: "bold",
        margin: "3%",
        textAlign: "center",
    },
    btnText: {
        fontSize: 30,
        margin: "3%",
        textAlign: "center",
    },
    input: {
        fontSize: 30,
        borderColor: "grey",
        backgroundColor: "white",
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        margin: "3%",
    },
    loginBtn: {
        borderRadius: 10,
        margin: "3%",
        paddingHorizontal: 10,
        alignContent: "center",
        backgroundColor: "#63A375",
    },
});
export default Login;
