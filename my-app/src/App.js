import React from "react"
import "./App.css";
import Header from "./components/Header"
import Body from "./components/Body";
import RestaurantCard from "./components/RestaurantCard"


const AppLayout = () =>{
  return(
    <div className= "app">
    <Header></Header>
    <Body></Body>
    </div>
  )
}

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<AppLayout></AppLayout>)

export default AppLayout