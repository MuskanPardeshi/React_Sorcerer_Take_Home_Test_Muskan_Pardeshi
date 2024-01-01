import { useState,useEffect } from "react";
import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import { MENU_API } from "../utils/constant";

const RestaurantMenu = () =>{
const [resInfo,setresInfo] = useState(null)

const {resId} = useParams()

    useEffect(()=>{
        fetchMenu();
    },[])

const fetchMenu = async () =>{
    const data = await fetch(MENU_API + resId)
    const json = await data.json();
    console.log(json)
    setresInfo(json.data)
}
if(resInfo === null) return <Shimmer/>

const {name, cuisines, costForTwoMessage, avgRating} = 
resInfo?.cards[0]?.card?.card?.info;

 const {itemCards} = resInfo?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card;
 console.log(itemCards)
 


    return (
        <div className="menu">
            <h1>{name}</h1>
            <h3>{cuisines.join(",")}</h3>
            <h3>{costForTwoMessage}</h3>
            
            <li>{avgRating}</li>
            <h3>Menu</h3>
            <ul>
            {itemCards.map(item => 
             <li key={item.card.info.id}>
             {item.card.info.name} - {item.card.info.price/100}
             </li>
             )}
            </ul>
            
          
    
            
        </div>
    )
}

export default RestaurantMenu;