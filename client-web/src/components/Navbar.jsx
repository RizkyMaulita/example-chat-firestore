import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const loginUsername = localStorage.getItem("username");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/register");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
      <div className="container-fluid">
        <a className="navbar-brand">TMSChat</a>
        <div id="navbarSupportedContent">
          <div className="d-flex justify-content-center align-items-center">
            <div className="nav-item mx-3">Hi, {loginUsername} !</div>
            <button
              className="btn btn-outline-danger nav-item"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
