
'use client'

import axios from 'axios';
import {useState,useEffect} from 'react';


export default function Tost(){
const [posts,setPosts]=useState([])

async function fecthAll(){

const res = await axios.get('/api/tost')

setPosts(res.data.posts)

}

useEffect(()=>{

fecthAll()

},[])


return(

<>
{

posts.map(post=>(


<div key={post._id || post.id}> 
          <h1>{post.name}</h1>
          <h1>{post.message}</h1>
          <button>Delete</button>
        </div>


))

}
</>


)





}