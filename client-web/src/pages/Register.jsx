import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const findData = async () => {
    try {
      const { data } = await axios.get(API_URL + "/users");
      const findUser = data?.find((val) => val.name === name);
      return findUser;
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const findUser = await findData();
      if (findUser) {
        localStorage.setItem("userId", findUser.id);
        localStorage.setItem("username", name);
        navigate("/");
      } else {
        const { data } = await axios({
          url: API_URL + "/users",
          data: { name },
          method: "POST",
        });
        console.log(data);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", name);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container p-5 my-5 w-50 border">
      <h1 className="text-center mb-5">Login / Register</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e?.target?.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
