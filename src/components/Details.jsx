import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PiGreaterThan } from "react-icons/pi";

const ProductDetail = () => {
    const {id} = useParams()

    let [counter,setcounter] = useState(1)

    const increaseCounter = () => {
        counter = counter + 1
        setcounter(counter)
    }

    const decreaseCounter = () => {
        if(counter > 1){
            counter = counter - 1
            setcounter(counter)
        }
    }

    return(
        
            
        <div  className="mx-5 lg:mx-10 h-full">

            {/* Breadcrums */}
      
        
            <div className="container px-3 sm:px-4 md:px-8  mt-5 flex gap-2 items-center ">
              <Link
                to={"/"}
                className="text-base  sm:text-xl font-normal text-gray-500"
              >
                Home
              </Link>
              <PiGreaterThan />
              <Link to={'/cart'} className="text-sm  sm:text-base font-normal">Gaming</Link>
              <PiGreaterThan />
              <Link className="text-sm  sm:text-base font-normal">Havic haeavy</Link>
            </div>
            

            <div className='container mx-auto px-3 sm:px-4 md:px-8 lg:px-10 mt-5   grid grid-cols-3 gap-10'>

                <div className='col-span-2 bg-white grid grid-cols-3 gap-4'>

                    <div className='col-span-1 flex flex-col gap-5'>
                        <div className='bg-slate-200 flex justify-center items-center h-32'>
                            <img src="/Frame 706.png" alt="" className=' h-full' />

                        </div>
                         <div className='bg-slate-200 flex justify-center items-center h-32'>
                            <img src="/Frame 706.png" alt="" className=' h-full' />

                        </div>
                        <div className='bg-slate-200 flex justify-center items-center h-32'>
                            <img src="/Frame 706.png" alt="" className=' h-full' />

                        </div>
                         <div className='bg-slate-200 flex justify-center items-center h-32'>
                            <img src="/Frame 706.png" alt="" className=' h-full' />

                        </div>
                        
                        

                    </div>

                    <div className='col-span-2 bg-slate-200 flex justify-center items-center p-10'>
                        <img src="/Frame 706.png" alt=""  className='h-full'/>

                    </div>

                </div>
                <div className='col-span-1  '>

                    <div className='flex flex-col gap-2  '>
                        <p className='text-xl font-medium'>Havic HV G-92 Gamepad</p>
                        <p>Review ********</p>

                        <p className='text-xl font-bold'>!92$</p>
                        <p>its my complete product description , we are testing my product for the my exclusive website , and its a wonderfull product for my website.</p>
                         
                         <hr />
                         <div>
                            <p className='text-xl'>colors</p>
                            <p className='text-xl'>sizes</p>
                         </div>

                         <div className='flex'>

                         <div className='border-2  rounded flex '>
                            
                            <button onClick={decreaseCounter} className='text-2xl text-center border-r-2 px-2 py-1 hover:bg-red-500 hover:text-white'>-</button>
                            <div className='text-2xl text-center px-4 py-1  '>{counter}</div>
                            <button onClick={increaseCounter} className='text-2xl text-center border-l-2 px-2 py-1 hover:bg-red-500 hover:text-white'>+</button>
                        </div>

                        </div>

 

                         
                            
                          
                           
                         
                    </div>

                </div>


                
            </div>
        </div>
    )
}
export default ProductDetail;