 import React from "react"
import "./App.css";
import Header from "./components/Header"
import Body from "./components/Body";
// import RestaurantCard from "./components/RestaurantCard"
import {RouterProvider, createBrowserRouter,Outlet} from "react-router-dom";
import About from "./components/About";
import * as ReactDOM from "react-dom/client";
import Conatct from "./components/Contact";
import Error from "./components/Error";
import RestaurantMenu from "./components/RestaurantMenu";

const AppLayout = () =>{
  return(
    <div className= "app">
    <Header></Header>
    <Outlet/>
    </div>
  )
}

 const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    children:[
      {
        path: "/",
        element: <Body/>,
      },
      {
        path: "/about",
        element: <About/>,
      },
      {
        path:"/contact",
        element:<Conatct/>
    
      },
      {
        path:"/restaurants/:resId",
        element:<RestaurantMenu/>
      }
    ],
    errorElement:<Error/>
  },
 
]);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<RouterProvider router={AppRouter} />);

const App = ({ root }) => {
  root.render(<RouterProvider router={AppRouter} />);
  return null;
};


 export default App;
