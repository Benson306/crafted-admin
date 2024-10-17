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
import { AuthContext } from '../context/AuthContext'
import '../assets/css/ImagePopup.css';

function Events() {

    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setTitle(null)
        setDate(null)
        setDescription(null)
        setVenue(null)
        setPrice(0)
        setIsModalOpen(false)
    }
    const [imageSrc, setImageSrc] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

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

    const { token } = useContext(AuthContext);

    const [ title, setTitle ] = useState(null);
    const [ date, setDate ] = useState(null);
    const [ description, setDescription ] = useState(null);
    const [ venue, setVenue ] = useState(null);
    const [ price, setPrice ] = useState(0);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);

    const handleSubmit = () => {

        if(title == null || price < 1 || imageSrc == null || date == null || venue == null){
            toast('All fields must be filled',{
                type:'error'
            })
            return
        }

        const formData = new FormData();

        formData.append('title', title);
        formData.append('venue', venue);
        formData.append('price', price);
        formData.append('image', imageSrc)
        formData.append('description', description);
        formData.append('date', date);

        fetch(`${process.env.REACT_APP_API_URL}/add_event`,{
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
            }else{
              response.json().then( err => {
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

    const [data, setData] = useState([]);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/events`)
        .then((data) => data.json())
        .then(data=> {
            setData(data);
            setLoading(false);
        })
        .catch(err=>{
            setError(true);
            setLoading(false);
        })
    })

    const [isOpen, setIsOpen] = useState(false);

    const handleImageClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    function openEditModal() {
        setIsEditModalOpen(true)
    }

    function closeEditModal(){
        setTitle(null)
        setDate(null)
        setDescription(null)
        setVenue(null)
        setPrice(0)
        setIsEditModalOpen(false);
    }

    const handleDeleteItem = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/delete_event/${id}`,{
            method: "DELETE",
            headers: {
                "Authorization":`Bearer ${token}`
            }
        })
        .then(()=>{
            toast.success("Deleted Successfully");
        })
        .catch(err => {
            console.log(err);
            toast.error("Failed to delete");
        })

    }

    const handleEdit = () =>{
        if(title == null || price < 1 || imageSrc == null || date == null || venue == null){
            toast('All fields must be filled',{
                type:'error'
            })
            return
        }

        const formData = new FormData();

        formData.append('title', title);
        formData.append('venue', venue);
        formData.append('price', price);
        formData.append('image', imageSrc)
        formData.append('description', description);
        formData.append('date', date);
    
        fetch(`${process.env.REACT_APP_API_URL}/edit_event/${editId}`,{
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

  return (
    <div>
        <PageTitle>Manage Events</PageTitle>

        <ToastContainer />

      <div className="flex mr-5 mb-5 justify-end">
        <Button onClick={openModal}>Add new event</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add An Event</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>

        <Label className="mt-2">
          <span>Event Poster</span>
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
        
        <Label className="mt-2">
          <span>Title</span>
          <Input className="mt-1" type="text" placeholder="Event title" onChange={e => setTitle(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Description</span>
          <Textarea className="mt-1" rows="3" placeholder="Enter some description" onChange={e => setDescription(e.target.value)} required />
        </Label>

        <Label className="mt-2">
          <span>Venue</span>
          <Input className="mt-1" type="text" placeholder="Venue" onChange={e => setVenue(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Date</span>
          <Input className="mt-1" type="date" onChange={e => setDate(e.target.value)} required/>
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
        <ModalHeader>Edit Event</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>

        <Label className="mt-2">
          <span>Event Poster</span>
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
        
        <Label className="mt-2">
          <span>Title</span>
          <Input className="mt-1" type="text" placeholder="Event title" onChange={e => setTitle(e.target.value)} value={title} required/>
        </Label>

        <Label className="mt-2">
          <span>Description</span>
          <Textarea className="mt-1" rows="3" placeholder="Enter some description" onChange={e => setDescription(e.target.value)} value={description} required />
        </Label>

        <Label className="mt-2">
          <span>Venue</span>
          <Input className="mt-1" type="text" placeholder="Venue" onChange={e => setVenue(e.target.value)} value={venue} required/>
        </Label>

        <Label className="mt-2">
          <span>Date</span>
          <Input className="mt-1" type="date" onChange={e => setDate(e.target.value)} value={date} required/>
        </Label>

        <Label className="mt-2">
          <span>Price</span>
          <Input className="mt-1" type="number" placeholder="0" onChange={e => setPrice(e.target.value)} value={price} required/>
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
              <TableCell>Poster</TableCell>
              <TableCell>Title & Description</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Date</TableCell>
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
                        src={`${process.env.REACT_APP_API_URL}/uploads/${dt.poster}`}
                        className="p-0 rounded-t-lg h-40 w-40 object-contain cursor-pointer"
                        alt="No image Uploaded"
                        onClick={handleImageClick}
                    />

                    {isOpen && (
                        <div className="modal-overlay" onClick={handleClose}>
                            <div className="modal-content">
                                <button className="close-button" onClick={handleClose}>X</button>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/uploads/${dt.poster}`}
                                    className="modal-image"
                                    alt="No image Uploaded"
                                />
                            </div>
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <span className="text-sm font-bold">{dt.title}</span>
                    <br />
                    <div className="text-xs capitalize whitespace-normal">{dt.description}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{dt.venue}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs capitalize">{dt.date}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs capitalize">Ksh. {dt.price}</span>
                </TableCell>
                <TableCell>
                    <button 
                    onClick={ e=> {
                        e.preventDefault();
                        setEditId(dt._id);
                        setTitle(dt.title)
                        setDate(dt.date)
                        setDescription(dt.description)
                        setVenue(dt.venue)
                        setPrice(dt.price)
                        setImageUrl(`${process.env.REACT_APP_API_URL}/uploads/${dt.poster}`);
                        setImageSrc(dt.poster);
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

    </div>
  )
}

export default Events