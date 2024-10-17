import React, { useContext, useEffect, useState } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
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
  Pagination,
  Alert
} from '@windmill/react-ui'


import { EditIcon, TrashIcon } from '../icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext'


function ManageRegularUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  const [isModalDelOpen, setIsModalDelOpen] = useState(false)

  function openDelModal() {
    setIsModalDelOpen(true)
  }

  function closeDelModal() {
    setIsModalDelOpen(false)
  }

  const [isModalChangeOpen, setIsModalChangeOpen] = useState(false)

  function openChangeModal() {
    setIsModalChangeOpen(true)
  }

  function closeChangeModal() {
    setIsModalChangeOpen(false)
  }

  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [master, setMaster] = useState(null);
  const [delMasterPass, setDelMAasterPass] = useState(null);
  const [delId, setDelId] = useState(null);
  const [passLength, setPassLength] = useState(false);
  const [same, setSame] = useState(false);
  const [error, setError] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [change, setChange] = useState(false);

  const { token, logout } = useContext(AuthContext);

  useEffect(()=>{
    if(password.length > 7){
      setPassLength(true)
    }else{
      setPassLength(false);
    }

    if(password === confPassword){
      setSame(true);
    }else{
      setSame(false);
    }

  },[password])


  useEffect(()=>{
    
    if(password === confPassword){
      setSame(true);
    }else{
      setSame(false);
    }

    if(password.length > 7){
      setPassLength(true)
    }else{
      setPassLength(false);
    }

  },[confPassword])

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/regular_users`,{
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then(result =>{
      if(result.ok){
        result.json().then(response =>{
          setData(response)
          setLoading(false);
        })
      }else{
        result.json().then(response => {
          logout();
        })
      }
        
    })
    .catch(err => {
      setError(true);
      setLoading(false);
      console.log(err)
    })
  },[change])

  function handleSubmitDelete(master, id){
    fetch(`${process.env.REACT_APP_API_URL}/delete/${master}/${id}`,{
      method:'DELETE',
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( result => {
      if(result.ok){
        result.json().then(res =>{
          toast('Success',{
            type:'success'
          });
          setChange(!change);
          closeDelModal();
        })
      }else{
        result.json().then(res =>{
          toast(res,{
            type:'error'
          });
        })
      }
    })
    .catch(err =>{
      toast('Failed',{
        type:'error'
      })
    })
  }

  const [newPassword, setNewPassword] = useState(null);
  const [changeMaster, setChangeMaster] = useState(null);
  const [changeId, setChangeId] = useState(null);

  function handleChangePassword(master, new_pass, user_id){
    fetch(`${process.env.REACT_APP_API_URL}/change_admin_password`,{
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify({
        master_password: master,
        new_password: newPassword,
        user_id
      })
    })
    .then( result => {
      if(result.ok){
        result.json().then(res =>{
          toast('Success',{
            type:'success'
          });
          closeChangeModal();
        })
      }else{
        result.json().then(res =>{
          toast(res,{
            type:'error'
          });
        })
      }
    })
    .catch(err =>{
      toast('Failed',{
        type:'error'
      })
    })
  }

  return (
    <>
      <ToastContainer />
      
      <PageTitle>Manage Regular Users</PageTitle>

      <Modal isOpen={isModalDelOpen} onClose={closeDelModal}>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
        <Label>
          <span>Master Password</span>
          <Input className="mt-1" type="password" placeholder="******" onChange={e => setDelMAasterPass(e.target.value)} required/>
        </Label>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeDelModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={() => handleSubmitDelete(delMasterPass, delId)}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeDelModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={() => handleSubmitDelete(delMasterPass, delId)}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalChangeOpen} onClose={closeChangeModal}>
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
        <Label>
          <span>New Password</span>
          <Input className="mt-1" type="password" placeholder="******" onChange={e => setNewPassword(e.target.value)} required/>
        </Label>

        <Label>
          <span>Master Password</span>
          <Input className="mt-1" type="password" placeholder="******" onChange={e => setChangeMaster(e.target.value)} required/>
        </Label>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeChangeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={() => handleChangePassword(changeMaster, newPassword, changeId)}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeChangeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={() => handleChangePassword(changeMaster, newPassword, changeId)}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>

        <div className='mt-2 mb-2 dark:text-gray-500 text-sm'>Total Users: {data.length}</div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User Info</TableCell>
              <TableCell>Change Password?</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
              loading && <TableRow><TableCell><div>Loading....</div></TableCell></TableRow>
            }
            {
              !loading && error && <TableRow><TableCell><div>Your token has expired, Logout and login</div></TableCell></TableRow>
            }
            {
              !loading && !error && data.length === 0 && <TableRow><TableCell><div>No records to show</div></TableCell></TableRow>
            }
            {!loading && !error && data.reverse().map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.first_name} {user.second_name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <button className='text-sm underline text-blue-500 hover:text-blue-600' onClick={()=>{
                    setChangeId(user._id);
                    openChangeModal();
                  }}>change password</button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    {/* <Button layout="link" size="icon" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button> */}
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>{
                      setDelId(user._id);
                      openDelModal();
                    }}>
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter> */}
      </TableContainer>
    </>
  )
}

export default ManageRegularUsers
