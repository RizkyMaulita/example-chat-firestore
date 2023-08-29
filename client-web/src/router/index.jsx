import { createBrowserRouter, redirect } from "react-router-dom";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw redirect("/register");
      }

      return null;
    },
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        throw redirect("/");
      }

      return null;
    },
  },
]);

export default router;
