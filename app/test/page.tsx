'use client';

import axios from 'axios';
import { useState } from 'react'; // ১. এখানে কার্লি ব্র্যাকেট হবে
import Tost from '@/components/Tost'

export default function Page() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    console.log("Name:", name, "Message:", message);
    const post = await axios.post('/api/test',{name,message})

  };

  return (
    <>
      <div className="w-full h-screen p-5"> {/* ২. className ব্যবহার করুন */}
        
        <input 
          type="text" 
          className="p-4 border" 
          name="name"
          placeholder="আপনার নাম"
          onChange={(e) => setName(e.target.value)} 
        />
        <br />

        <input 
          type="text" 
          className="p-4 border mt-2"
          name="message" 
          placeholder="মেসেজ"
          onChange={(e) => setMessage(e.target.value)} 
        />
        <br />

        {/* ৩. onClick-এ কোটেশন ছাড়া ফাংশন নাম দিন */}
        <button 
          className="bg-blue-500 text-white p-2 mt-2" 
          onClick={handleSubmit}
        >
          Submit
        </button>
        
        <Tost/>

      </div>
    </>
  );
}
