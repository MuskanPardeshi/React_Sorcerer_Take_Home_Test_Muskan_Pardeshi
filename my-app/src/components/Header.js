import { LOGO_URL } from "../utils/constant";

const Header = () => {
    return(
      <div className="header">
        <div > 
          <img 
          className="logo" src ={LOGO_URL} />
        </div>
        <div className="nav-item">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact Us</li>
            <li>Cart</li>
          </ul>
        </div>
      </div>
    )
    }

    export default Header;