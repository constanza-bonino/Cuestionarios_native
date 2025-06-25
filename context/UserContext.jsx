import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(false);

	const getCurrentUser = () => {
		if (!user) {
			const storedUser = JSON.parse(localStorage.getItem("user"));
			if (storedUser) {
				setUser(storedUser);
				return storedUser;
			} else {
				null;
			}
		} else {
			return user;
		}
	}

	const setCurrentUser = (user) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
	}

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

    return (
        <UserContext.Provider value={{ getCurrentUser, setCurrentUser, fetchUsuario, crearUsuario }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);