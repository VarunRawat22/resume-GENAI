import {createBrowserRouter} from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";






export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path:"/",
        element: <Protected><Home /></Protected> // home page ko protected component se wrap kr denge taki wo sirf tabhi access ho jab user login ho
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected> // interview page ko bhi protected component se wrap kr denge taki wo bhi sirf tabhi access ho jab user login ho
    }


])