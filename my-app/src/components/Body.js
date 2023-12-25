import RestaurantCard from "./RestaurantCard";
import reslist from "../utils/mockData";
import {useState} from "react"
import React from "react"


const Body = () =>{
const [ListOfRestaurants,setListOfRestaurant] = useState(reslist)


    return(
    <div className="body">
    <div className="filter">
    <button 
    className="filter-btn" 
    onClick = {() => {
      const filteredList = ListOfRestaurants.filter(
      (res) => res.info.avgRating>4
    );
    setListOfRestaurant(filteredList);
    } }>
        Top-Rated Restaurant
      </button>
    </div>
      
      <div className="Restaurant-Container">
          <RestaurantCard resData={reslist[1]} />
        {ListOfRestaurants.map((resturant) => (
          <RestaurantCard key={resturant.info.id}resData ={resturant}/>
          ))}
  
        
      </div>
    </div>
  )
  }

  export default Body;