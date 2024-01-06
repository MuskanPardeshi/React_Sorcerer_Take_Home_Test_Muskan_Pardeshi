import React from "react";

class UserClass extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userInfo:{
                login:"dummy",
                id:"default",
                avatar_url:"default photo"
            }
        }
    }

   async componentDidMount(){
        const data = await fetch ("https://api.github.com/users/muskanpardeshi");
        const json = await data.json()
        console.log(json)

        this.setState({
            userInfo: json
        })
        console.log(json)
    }
   
    componentDidUpdate(){
        console.log("component did update")
    }
   componentWillUnmount(){
    console.log("component will unmount")
   }

    render(){
        const {login,id,avatar_url} = this.state.userInfo
        // debugger
        return(
            <div>
            <h2>name :{login}</h2>
            <h2>id:{id}</h2>
            <img src={avatar_url}></img>
            </div>
        )
    }
}

export default UserClass;