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

function ApprovedProducts() {
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
    fetch(`${process.env.REACT_APP_API_URL}/get_approved_products`)
    .then( data => data.json())
    .then( data => {
      //setDeliveredOrders(data); 
      //setTotalResults(data.length);
      setData(data)
      setLoading(false);
    } )
    .catch( err => { console.log(err) })
  },[change])


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

  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
      setIsOpen(true);
  };

  const handleClose = () => {
      setIsOpen(false);
  };

  return (
    <>
      <PageTitle>Approved Products</PageTitle>
      <ToastContainer />

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

export default ApprovedProducts
