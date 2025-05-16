import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from 'react-router-dom';

const CreateAccount = ({ onAccountCreated }) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    onAccountCreated();
    navigate('/');
  };

  

  return _jsxs("div", {
    style: { padding: '2rem' },
    children: [
      _jsx("h2", { children: "Create Account" }),
      _jsx("button", { onClick: handleCreate, children: "Sign Up" }),
      _jsxs("p", {
        style: { marginTop: '1rem' },
        children: [
          "Already have an account?",
          ' ',
          _jsx(Link, { to: "/login", children: "Login here" })
        ]
      })
    ]
  });
};

export default CreateAccount;
