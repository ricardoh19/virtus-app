import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Home from "./components/home";
import UserInfo from "./components/UserInfo";
import MyProfile from "./components/MyProfile";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import SearchResults from "./components/SearchResults";
import Groups from "./components/Groups";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/user-info",
      element: <UserInfo />,
    },
    {
      path: "/my-profile",
      element: <MyProfile />,
    },
    {
      path: "/user-profile/:uid",
      element: <UserProfile />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/search-results",
      element: <SearchResults />,
    },
    {
      path: "/groups",
      element: <Groups />,
    }
    
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;