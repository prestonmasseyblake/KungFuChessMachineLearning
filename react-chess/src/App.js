import logo from './logo.svg';
import './App.css';
import Chess from './components/Chess';
import axios from "axios";
import React, { useState, useEffect } from "react";
function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
     
     axios
       .get("http://localhost:8000/board/")
       .then((response) => {
         setData(response.data); 
         console.log(response.data);  
         setLoading(false); 
         let temp = []
         for (let i = 0; i < data.length; i++) {
           temp.push(data[i]);
         }
         console.log("this is the api data", data)
         setData(temp); 
       }) 
       .catch((error) => { 
         console.error(error); 
          
       });

   
   }, []);     
  
   if (loading) {
     return <div>Loading...</div>;
   }
  
  return ( 
    <div className="App">
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      { !loading ?
      <Chess dataa={data}/> : <div>Loading...</div> }
    </div>
  );
}

export default App;
 