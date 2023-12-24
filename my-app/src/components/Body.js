import RestaurantCard from "./RestaurantCard";
import reslist from "../utils/mockData";


const Body = () =>{
    return(
    <div className="body">
      <div className="search">
        Search
      </div>
      <div className="Restaurant-Container">
        {/* <RestaurantCard restaurantName ="Burger King"/>  // by using props rendering 
        <RestaurantCard restaurantName ="Biryani hourse"/>
        <RestaurantCard restaurantName ="Misal House"/>
        <RestaurantCard restaurantName ="Cazzy cheessy"/> */}
  
        <RestaurantCard resData={reslist[1]} />
        {reslist.map((resturant) => (
          <RestaurantCard key={resturant.info.id}resData ={resturant}/>
          ))}
  
        
      </div>
    </div>
  )
  }

  export default Body;