import { useState } from "react";
import { LOGO_URL } from "../utils/constant";
import {Link} from  "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";

const Header = () => {
const [loginbutton, setloginbutton]= useState ("Login")
const OnlineStatus = useOnlineStatus()


    return(
      <div className="header">
            <div className="logo-container"> 
            <img className="logo" src ={LOGO_URL} />
            </div>

            <div className="nav-item">
          <ul>
          <li>
            OnlineStatus:{OnlineStatus? "✅" : "🔴"}
          </li>
            <li>
            <Link to ="/">Home</Link>
            </li>
            <li>
            <Link to = "/about">About</Link>
            </li>
            <li>
            <Link to ="/contact">Contact Us</Link>
            </li>
            <li>Cart</li>

            <button 
            className="login-btn"
            onClick={() => { 
               loginbutton === "Login" 
              ? setloginbutton ("Logout") 
              : setloginbutton ("Login");
            }}> 
            {loginbutton}
            </button>

          </ul>
        </div>
      </div>
    )
    }

    export default Header;