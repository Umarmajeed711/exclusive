import React from 'react'
import Title from './Title'

const NewArrivals = () => {
  return (
    <div>

        <div className='mx-5 my-5 lg:mx-10  lg:my-8 '>


           
         <Title title="Featured" description="New Arrival"/>
        

            <div className='grid grid-cols-2 gap-10 '>

                 {/* Game */}

                <div className='col-span-1 flex items-end text-white p-10 game'>
                   
                    <div className=''>
                        <p className='text-4xl '>Play Station 5</p>
                        <p className='text-xl font-light'>Black and WHite PS5 gaming out</p>

                         <button className='underline'>Shop Now</button>
                    </div>

                </div>

                <div className='col-span-1 flex flex-col gap-10'>

 {/* Women */}
                    <div className='women h-[50%] flex items-end p-10'>

                   
                    <div className=''>
                        <p className='text-4xl '>Play Station 5</p>
                        <p className='text-xl font-light'>Black and WHite PS5 gaming out</p>

                         <button className='underline'>Shop Now</button>
                    </div>
</div>


              

                   <div className='h-[50%] flex gap-10'>

                   <div className='speaker flex items-end p-5'>
                 
                    <div className=''>
                        <p className='text-4xl '>Play Station 5</p>
                        <p className='text-xl font-light'>Black and WHite PS5 gaming out</p>

                         <button className='underline'>Shop Now</button>
                    </div>


                    </div>


                     <div className='perfume flex items-end p-5'>

                    <div className=''>
                        <p className='text-4xl '>Play Station 5</p>
                        <p className='text-xl font-light'>Black and WHite PS5 gaming out</p>

                         <button className='underline'>Shop Now</button>
                    </div>
                   </div>
                   </div>



                </div>


            </div>
        </div>
    </div>

    
  )
}

export default NewArrivals