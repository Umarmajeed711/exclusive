import Modal from '@mui/material/Modal';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useEffect } from 'react';
import * as yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import { Login } from '../pages/login';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import api from './api';

const Category = () => {



  const [apiError, setApiError] = useState("");
  const [loading,setloading] = useState(false)

    const CategoryValidation = yup.object({
    CategoryName: yup.string().required("Category name required"),
    CategoryDescription: yup.string().required("Category description required"),
   
  });

  const CategoryFormik = useFormik({
    initialValues: {
      CategoryName:"",
      CategoryDescription:""
     
    },
    validationSchema: CategoryValidation,

    onSubmit: async (values) => {
      setloading(true)
      

      try{
        let response =  await api.post(`/category` , {
          category_name: values.CategoryName,
          category_description: values.CategoryDescription
        })
         
       
          
                  setloading(false);
                  const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    },
                  });
                  Toast.fire({
                    icon: "success",
                    title: "Add Category",
                  });
        
                   closeForm()
                   getCategory()
        
                  
      
        
      }
      catch(error){
        setApiError(error?.response.data.message || "Something went wrong");
        setloading(false)
        
      }




     
    },
  });


  const [show,setShow] = useState(false);

  const showForm = () => {

    setShow(true)


  }

  const closeForm = () => {
    setShow(false)
    CategoryFormik.resetForm()
  }

   const [categoryList , setCategoryList] = useState([]);
      
      const getCategory = async () => {


        try{
            let result = await api.get(`/categories`)

            setCategoryList(result.data.categories);
            

        }catch(error){

        }
      }



useEffect(() => {
    getCategory()
},[])

   let Styles = {
    inputField:
      "border-b-2  bg-transparent p-1 outline-none focus:drop-shadow-xl w-[220px]",
  };

    return(
        
        <div>
            <button onClick={showForm}>Show Form</button>

            {/* Form Modal */}
      <div>
        <Modal open={show} onClose={closeForm}>
          <div className="flex justify-center items-center flex-col h-full">
             <div className="h-[40px] w-full flex justify-center items-center mb-2 overflow-hidden">
                    <Alert
                      severity="error"
                      className="transition-all duration-300 max-w-[350px] text-sm px-4 py-1"
                      style={{
                        opacity: apiError ? 1 : 0,
                        visibility: apiError ? "visible" : "hidden",
                      }}
                    >
                      {apiError || "placeholder"}
                    </Alert>
                  </div>
            <form
              onSubmit={CategoryFormik.handleSubmit}
              className=" bg-white p-6 shadow-2xl rounded w-96 my-10"
            >
              <div className="flex justify-end">
                <span
                  onClick={closeForm}
                  className="text-xl hover:text-red-500 hover:shadow-xl"
                >
                 <AiOutlineClose/>
                </span>
              </div>

              <div className="flex flex-col justify-center  ">
                <p className="text-3xl font-bold  m-5 text-center">
                  Category Form
                </p>

                {/* Category Name */}
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="CategoryName">
                    <span className="text-xl ">
                      Name
                    </span>
                  </label>
                  <div>
                    <input
                      type="text"
                      name="CategoryName"
                      id="CategoryName"
                      value={CategoryFormik.values.CategoryName}
                      onChange={CategoryFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {CategoryFormik.touched.CategoryName &&
                    Boolean(CategoryFormik.errors.CategoryName) ? (
                      <p className="requiredError">
                        {CategoryFormik.touched.CategoryName &&
                          CategoryFormik.errors.CategoryName}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                 {/* Category Description*/}
                <div className="flex gap-3 items-center">
                  <label htmlFor="CategoryDescription">
                    <span className="text-xl ">
                      
                      Description
                    </span>
                  </label>
                  <div>
                    <input
                      type="text"
                      name="CategoryDescription"
                      id="CategoryDescription"
                      value={CategoryFormik.values.CategoryDescription}
                      onChange={CategoryFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {CategoryFormik.touched.CategoryDescription &&
                    Boolean(CategoryFormik.errors.CategoryDescription) ? (
                      <p className="requiredError">
                        {CategoryFormik.touched.CategoryDescription &&
                          CategoryFormik.errors.CategoryDescription}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>


                

            
               
                
 <button disabled={loading} type="submit"
 className=" bg-red-600 transition-all duration-200 rounded flex justify-center p-2 my-4 text-white  hover:shadow-red-400 hover:shadow-md">
            {loading ? (
              <div className="flex items-center p-2 gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              </div>
            ) : (
              "Add Category"
            )}
          </button>

                
                
              </div>
            </form>
          </div>
        </Modal>
      </div>


       <table className='border border-collapse'>
        <thead>
          <tr>
            <th>Category id</th>
            <th>Category Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.map((eachCategory , i) => {
            return(
              <tr key={i}>
                <td>{eachCategory?.category_id}</td>
                <td>{eachCategory?.category_name}</td>
                <td>{eachCategory?.category_description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

        </div>
            
        
    )
}
export default Category;