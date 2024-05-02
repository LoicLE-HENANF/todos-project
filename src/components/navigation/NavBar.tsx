import { useAuth } from "../providers/AuthProvider.tsx";
import { Link } from "react-router-dom";

function NavBar() {
    const { user, logout } = useAuth();

    // Array of route paths and labels
    const navLinks = [
        { path: "/todos", label: "Todos" },
        { path: "/users", label: "Users" },
        { path: "/login", label: "Login" },
        { path: "", label: "Logout" }
    ];

    return (
        <nav>
            <h1 className="mb-4">Welcome {user ? `${user.username}` : null}</h1>
            <ul className="flex">
                {/* Map over navLinks array */}
                {navLinks.map((link, index) => (
                    <li key={index}>
                        {/* For the Logout button, handle logout onClick */}
                        {link.label === "Logout" ? (
                            <button className="no-underline text-white mx-4" onClick={logout}>{link.label}</button>
                        ) : (
                            <Link to={link.path}>
                                <button className="no-underline text-white mx-4">{link.label}</button>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;
