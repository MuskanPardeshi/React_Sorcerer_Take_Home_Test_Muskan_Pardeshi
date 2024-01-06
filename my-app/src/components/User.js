// for function and class component

import { useState } from "react";

const User = ({name, location}) => {
    const [Count, setCount] = useState(0);
    const [Count1, setCount1] = useState(1)
    return(
        <div>
            <h2>name:{name}</h2>
            <h2>count ={Count1}</h2>
            <h2>count = {Count}</h2>
            <h2>location:{location}</h2>
            <h2>conact : 123</h2>
        </div>

    )
    
}

export default User;