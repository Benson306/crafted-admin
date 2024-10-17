import React, { useState, useEffect, useContext } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui'

import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

import { EditIcon, TrashIcon } from '../icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import response from '../utils/demo/tableData'
import { AuthContext } from '../context/AuthContext'
import useAuthCheck from '../utils/useAuthCheck'
import '../assets/css/ImagePopup.css';

const response2 = response.concat([])

function MyProducts() {
  const [pageTable, setPageTable] = useState(1)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  // setup data for every table
  const [loading, setLoading] = useState(true)

  // pagination setup
  const resultsPerPage = 5

  const [totalResults, setTotalResults] = useState(0);

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
  }
  const [productName, setProductName] = useState(null);
  const [type, setType] = useState(null);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState(null);
  const [size, setSize] = useState(null);
  const [error, setError] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);


  const [change, setChange] = useState(false);
  const { token } = useContext(AuthContext);
  useAuthCheck();

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/my_products`,{
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => {
      //setDeliveredOrders(data); 
      //setTotalResults(data.length);
      setData(data)
      setLoading(false);
    } )
    .catch( err => { console.log(err) })
  },[change])

  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setProductName(null);
    setType(null);
    setPrice(0);
    setDescription(null);
    setSize(null);
    setImageUrl(null);
    setImageSrc(null);
    setIsModalOpen(false);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImageSrc(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDelete = () => {
    setImageSrc(null);
  };

  const handleSubmit = () => {

        if(productName == null || price < 1 || imageSrc == null || type == null || size == null || description == null){
            toast('All fields must be filled',{
                type:'error'
            })
            return
        }

        const formData = new FormData();

        formData.append('productName', productName);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('image', imageSrc)
        formData.append('description', description);
        formData.append('size', size);

        fetch(`${process.env.REACT_APP_API_URL}/add_product`,{
            method: 'POST',
            headers: {
              'Authorization':`Bearer ${token}`
            },
            body: formData
        })
        .then((response)=>{
            if(response.ok){
                closeModal();
                toast('Success',{
                    type:'success'
                })
                setChange(true)
            }else{
              response.json().then( err => {
                console.log(err)
                })
                toast('Server Error',{
                    type:'error'
                })
            }
        })
        .catch((err)=>{
            toast('Server Error',{
                type:'error'
            })
        })
    }

  const handleDeleteItem = ( id ) => {
      fetch(`${process.env.REACT_APP_API_URL}/del_product/${id}`,{
          method: 'DELETE',
          headers: {
            'Authorization':`Bearer ${token}`
          }
      })
      .then((response)=>{
          if(response.ok){
              toast('Success',{
                  type:'success'
              })
              setChange(!change)
          }else{
              toast('Server Error',{
                  type:'error'
              })
          }
      })
      .catch((err)=>{
          toast('Server Error',{
              type:'error'
          })
      })
  }

  const handleAvailabilityToggle = (id, value) => {
      fetch(`${process.env.REACT_APP_API_URL}/change_availability/${id}`,{
          method: 'POST',
          headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
          },
          body: JSON.stringify({
              value: value
          })
      })
      .then((response)=>{
          if(response.ok){
              toast('Status Updated',{
                  type:'success'
              })
              setChange(!change);
          }else{
              toast('Server Error',{
                  type:'error'
              })
          }
      })
      .catch((err)=>{
          toast('Server Error',{
              type:'error'
          })
      })
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  function openEditModal() {
    setIsEditModalOpen(true)
  }

  function closeEditModal(){
    setProductName(null);
    setType(null);
    setPrice(0);
    setDescription(null);
    setSize(null);
    setImageUrl(null);
    setImageSrc(null);
    setIsEditModalOpen(false);
  }

  const handleEdit = () =>{
    if(productName == null || price < 1 || imageSrc == null || type == null){
        toast('All fields must be filled',{
            type:'error'
        })
        return
    }

    const formData = new FormData();

    formData.append('productName', productName);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('image', imageSrc)
    formData.append('description', description);
    formData.append('size', size);

    fetch(`${process.env.REACT_APP_API_URL}/edit_product/${editId}`,{
        method: 'PUT',
        headers: {
          'Authorization':`Bearer ${token}`
        },
        body: formData
    })
    .then((response)=>{
        if(response.ok){
            closeEditModal();
            toast('Success',{
                type:'success'
            })
            setChange(true);
        }else{
          response.json().then( err => {
            console.log(err)
            })
            toast('Server Error',{
                type:'error'
            })
        }
    })
    .catch((err)=>{
        toast('Server Error',{
            type:'error'
        })
    })
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
      setIsOpen(true);
  };

  const handleClose = () => {
      setIsOpen(false);
  };

  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/get_categories`,{
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => {
      setCategories(data)
    } )
    .catch( err => { console.log(err) })
  },[])

  return (
    <>
      <PageTitle>My Products</PageTitle>
      <ToastContainer />

      <div className="flex mr-5 mb-5 justify-end">
        <Button onClick={openModal}>Add A Product</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add A Product</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>

        <Label className="mt-2">
          <span>Product Image</span>
          <br />
        <div
            className="flex items-center justify-center w-full mt-1"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            {imageSrc ? (
                <div className="h-40 w-full relative flex">
                <button
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    onClick={handleDelete}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                />
                </div>
            ) : (
                <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and
                    drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) =>{ setImageSrc(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0]) )}}
                />
                </label>
            )}
        </div>

        </Label>

        <Label className="mt-4">
          <span>Category</span>
          <Select className="mt-1" onChange={e => setType(e.target.value)}>
            <option value={null}></option>
            {
              categories.length > 0 && categories.map(category => 
                  <option value={category.category}>{category.category}</option>
              )
            }
          </Select>
        </Label>
        
        <Label className="mt-2">
          <span>Product Name</span>
          <Input className="mt-1" type="text" placeholder="Product name" onChange={e => setProductName(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Description</span>
          <Textarea className="mt-1" rows="3" placeholder="Enter some description" onChange={e => setDescription(e.target.value)} required />
        </Label>

        <Label className="mt-2">
          <span>Size</span>
          <Input className="mt-1" type="text" placeholder="50 X 40" onChange={e => setSize(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Price</span>
          <Input className="mt-1" type="number" placeholder="0" onChange={e => setPrice(e.target.value)} required/>
        </Label>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleSubmit}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Product</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>

        <Label className="mt-2">
          <span>Product Image</span>
          <br />
        <div
            className="flex items-center justify-center w-full mt-1"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            {imageSrc ? (
                <div className="h-40 w-full relative flex">
                <button
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    onClick={handleDelete}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                />
                </div>
            ) : (
                <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and
                    drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) =>{ setImageSrc(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0]) )}}
                />
                </label>
            )}
        </div>

        </Label>

        <Label className="mt-4">
          <span>Category</span>
          <Select className="mt-1" onChange={e => setType(e.target.value)}>
          <option className='capitalize' value={type}>{type}</option>
            {
              categories.length > 0 && categories.map(category => 
                  <option value={category.category}>{category.category}</option>
              )
            }
          </Select>
        </Label>
        <Label className="mt-2">
          <span>Product Name</span>
          <Input className="mt-1" type="email" placeholder="Product name" value={productName} onChange={e => setProductName(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Description</span>
          <Textarea className="mt-1" rows="3" placeholder="Enter some description" value={description} onChange={e => setDescription(e.target.value)} required />
        </Label>

        <Label className="mt-2">
          <span>Size</span>
          <Input className="mt-1" type="text" placeholder="description" value={size} onChange={e => setSize(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Price</span>
          <Input className="mt-1" type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} required/>
        </Label>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleEdit}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleEdit}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Image</TableCell>
              <TableCell>Name & Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Description</TableCell>
              <TableCell className="text-center">In Stock?</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            data.length === 0 ? <TableCell>No Records</TableCell> :
            
            data.map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                    <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${dt.image}`}
                        className="p-0 rounded-t-lg h-40 w-40 object-contain cursor-pointer"
                        alt="No image Uploaded"
                        onClick={handleImageClick}
                    />

                    {isOpen && (
                        <div className="modal-overlay" onClick={handleClose}>
                            <div className="modal-content">
                                <button className="close-button" onClick={handleClose}>X</button>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/uploads/${dt.image}`}
                                    className="modal-image"
                                    alt="No image Uploaded"
                                />
                            </div>
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <span className="text-sm">{dt.productName}</span>
                    <br />
                    <span className="text-xs capitalize">{dt.type}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{dt.size}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs capitalize">{dt.description}</span>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                      <Input type="checkbox" 
                      className="border border-black"
                      checked={dt.availability}
                      onChange={(e)=> handleAvailabilityToggle( dt._id ,e.target.checked)}
                      />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs capitalize">Ksh. {dt.price}</span>
                </TableCell>
                <TableCell>
                    <button 
                    onClick={ e=> {
                      e.preventDefault();
                      setEditId(dt._id);
                      setProductName(dt.productName);
                      setType(dt.type);
                      setPrice(dt.price);
                      setDescription(dt.description);
                      setSize(dt.size);
                      setImageUrl(`${process.env.REACT_APP_API_URL}/uploads/${dt.image}`);
                      setImageSrc(dt.image);
                      openEditModal();
                    }} 
                    className='text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>
                      Edit
                    </button>
                </TableCell>
                <TableCell>
                    <button onClick={e => {
                        e.preventDefault();
                        handleDeleteItem(dt._id);
                    }} className='text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
        </TableFooter>
      </TableContainer>
    </>
  )
}

export default MyProducts
