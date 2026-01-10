import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
     <div className="mx-5 lg:mx-10">
      {/* BreadCrums */}
      <div className=" mx-auto px-8 py-4">
        <div>
          <Link to="/" className="text-gray-500">
            Home
          </Link>{" "}
          <span>/</span> <span>404 Error</span>
        </div>
      </div>


      <div className='flex justify-center items-center  '>
        <div className='flex flex-col gap-5 items-center '>
            <p className='text-[60px] font-bold'>404 Not Found</p>
            <p className='text-sm font-medium'>Your visited page not found.You may go home page. </p>

            <div className="flex justify-end items-center">
            <Link
             to="/"
              
             
               className=" bg-theme-primary transition-all duration-200 rounded flex justify-center px-8 py-3 my-4 text-white  hover:shadow-theme-secondary hover:shadow-md"
              
            >
             
              Back to home page
            </Link>
           </div>
        </div>


        


      </div>



      

        

          

          

    

      
    </div>
  )
}

export default NotFound