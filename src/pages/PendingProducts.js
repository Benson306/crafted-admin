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

function PendingProducts() {
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



  const [change, setChange] = useState(false);
  const { token } = useContext(AuthContext);
  useAuthCheck();

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/get_unapproved_products`)
    .then( data => data.json())
    .then( data => {
      //setDeliveredOrders(data); 
      //setTotalResults(data.length);
      setData(data)
      setLoading(false);
    } )
    .catch( err => { console.log(err) })
  },[change])


  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
      setIsOpen(true);
  };

  const handleClose = () => {
      setIsOpen(false);
  };

  const [dissapprovalReason, setDissapprovalReason] = useState(null);

  const handleApproval = (item_id, approval_value) => {
    fetch(`${process.env.REACT_APP_API_URL}/approve_product/${item_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify({
        approval_value,
        dissapprovalReason
      })
    })
    .then((response)=>{
      if(response.ok){
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  function openEditModal() {
    setIsEditModalOpen(true)
  }

  function closeEditModal(){
    setDissapprovalReason(null);
    setIsEditModalOpen(false);
  }

  const handleEdit = () =>{
    handleApproval(editId, 2);
    closeEditModal();
  }

  return (
    <>
      <PageTitle>Products Pending Approval</PageTitle>
      <ToastContainer />

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Image</TableCell>
              <TableCell>Name & Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Approve/Reject</TableCell>
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
                  <span className="text-xs capitalize">Ksh. {dt.price}</span>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                      <button 
                      onClick={ e=> {
                        e.preventDefault();
                        handleApproval(dt._id, 1);
                      }} 
                      className='text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>
                        Approve
                      </button>
                      <button onClick={e => {
                          e.preventDefault();
                          setEditId(dt._id);
                          openEditModal();
                      }} className='text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>
                        Reject
                      </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
        </TableFooter>
      </TableContainer>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Reject product application</ModalHeader>
        <ModalBody>

        <Label className="mt-2">
          <span>Reason For Denial</span>
          <Textarea className="mt-1" rows="3" placeholder="Reason for denial" onChange={e => setDissapprovalReason(e.target.value)} required />
        </Label>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleEdit}>
            <Button>Submit Rejection</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleEdit}>
              Submit Rejection
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default PendingProducts
