import React from 'react'

const Title = (props) => {
  return (
    <div>
         <div className="flex flex-col  gap-5 my-5 sm:my-10">
        <div className="flex gap-5 items-center">
          <p className="h-10 w-5 rounded bg-theme-primary"></p>
          <p className="text-theme-primary text-xl font-medium">{props.title}</p>
        </div>
        <div className="text-3xl sm:text-4xl font-medium">{props.description}</div>
      </div>
    </div>
  )
}

export default Title