import User from "./User" ;
import UserClass from "./UserClass"
import React from "react";


class About extends React.Component {
constructor(props){
    super(props)
//     console.log(" parent constructer")
 }

componentDidMount(){
    // console.log("parent componentdidmount")
}

    render(){
        // console.log("parent render")
        return(
            <div>
                     <h1>it is muskan about</h1>
                     {/* <User name ={"muskan function"} location ={"pune"}/> */}
                     <UserClass name ={"muskan"} location ={"pune"}/>
                     
                     
            </div>
        )
        }
}



// const About = () => {
//     return(
//         <div>
//         <h1>it is muskan about</h1>
//         <User name ={"muskan function"} location ={"pune"}/>
//         <UserClass name ={"muskan class"} location ={"pune"}/>
//         </div>
       
//     )
// }

export default About;