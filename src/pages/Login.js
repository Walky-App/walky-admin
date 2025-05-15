import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from 'react-router-dom';
const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const handleLogin = () => {
        onLogin();
        navigate('/');
    };
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h2", { children: "Login Page" }), _jsx("button", { onClick: handleLogin, children: "Log In" }), _jsxs("p", { style: { marginTop: '1rem' }, children: ["Don\u2019t have an account?", ' ', _jsx(Link, { to: "/create-account", children: "Create one" })] })] }));
};
export default Login;
