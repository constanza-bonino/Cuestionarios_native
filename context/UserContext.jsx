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
				return ({ id: "1", name: "coty" });
			}
		} else {
			return user;
		}
	}

	const setCurrentUser = (user) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
	}

	return (
		<UserContext.Provider value={{ getCurrentUser, setCurrentUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);