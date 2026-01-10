import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../components/api';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const Verify_email = () => {

     const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
     const token = query.get("token");
    

    const verify_email = async () => {

        console.log("TOken for email" , token);
        

        try {
        let response =  await api.post(`/verify-email?token=${token}`);

        Swal.fire(
                    "Verified",
                    "Email verified! You can now login your account.",
                    "success"
                  );

       navigate("/login")
        

    } catch (error) {
        console.log(error);
        

        Swal.fire(
                    "warning",
                    "Email verification failed!",
                    "warning"
                  );
        
    }
   
        
    }
    verify_email()

},[navigate])

    

    
  return (
    <div className='main w-full flex justify-center items-center'>
        <div className='text-2xl text-bold'>
            Verifying your email...
        </div>
    </div>
  )
}

export default Verify_email