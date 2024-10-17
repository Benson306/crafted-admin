import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Pagination,
    Label, Input,
    Modal, ModalHeader, ModalBody, ModalFooter, Button
  } from '@windmill/react-ui'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
import useAuthCheck from '../utils/useAuthCheck';

function ManageCategories() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [editId, setEditId] = useState(null);
    const [change, setChange] = useState(false);

    const { token } = useContext(AuthContext);

    useAuthCheck();

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/get_categories`,{
          headers: {
            'Authorization':`Bearer ${token}`
          }
        })
        .then( response => {
            if(response.ok){
                response.json().then(res => {
                    setData(res);
                    setLoading(false);
                })
            }else{
                setError(true);
                setLoading(false);
            }
        })
        .catch(err => {
            setError(true);
            setLoading(false);
        })
    }, [change])

    const handleSubmit = () => {
        if(category == null){
            toast("All fields must be filled",{
                type:'error'
              });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/add_category`,{
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                category
            })
        })
        .then(response => {
            if(response.ok){
                response.json().then(res => {
                    toast('Success',{
                        type:'success'
                      });
                    setChange(!change);
                    closeModal();
                })
            }else{
                toast("Category already exists",{
                    type:'error'
                  });
            }
        })
    }

    const handleDelete = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/del_category/${id}`,{
            method:'DELETE',
            headers:{
              'Authorization':`Bearer ${token}`
            }
        })
        .then((res)=>{
            if(res.ok){
                toast('Success',{
                    type:'success'
                  });
                setChange(!change);
            }else{
                toast("category already exists",{
                    type:'error'
                  });
            }
        })
    }

    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    const [isEditModalOpen, setEditModalOpen] = useState(false)

    function openEditModal() {
        setEditModalOpen(true)
    }

    function closeEditModal() {
        setEditModalOpen(false)
    }

    const handleEdit = () => {
        fetch(`${process.env.REACT_APP_API_URL}/edit_category/${editId}`,{
            method:'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                category
            })
        })
        .then((res)=>{
            if(res.ok){
                toast('Success',{
                    type:'success'
                  });
                setChange(!change);
                closeEditModal();
            }else{
                toast("Server error",{
                    type:'error'
                  });
            }
        })
    }

    const [search, setSearch] = useState(null);

    const filteredData = data.filter((item)=>{
                    
        if(search === '' || search === null){
            return item;
        }else if(
            item.category.toLowerCase().includes(search.toLowerCase())
        ){
            return item;
        }
    })

  return (
    <div>
      <PageTitle>Manage Categories</PageTitle>
      <ToastContainer />

      <div className="flex mr-5 mb-5 justify-between">
        <input type="text" 
            placeholder='Search ...' 
            className='p-2 rounded-lg bg-transparent border border-gray-300 dark:border-gray-500 text-black dark:text-gray-500' 
            onChange={(e)=> e.target.value === "" ? setSearch(null) : setSearch(e.target.value)}
        />
        <Button onClick={openModal}>Add new category</Button>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Category</TableCell>
              <TableCell></TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            filteredData.length === 0 ? <TableCell>No Records</TableCell> :
            
            filteredData.map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">{dt.category}</span>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                    <div className='flex gap-4'>
                        <button onClick={e => {
                            e.preventDefault();
                            setEditId(dt._id);
                            setCategory(dt.category);
                            openEditModal();
                            //handle(dt._id);
                        }} className='text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>Edit</button>
                        <button onClick={e => {
                            e.preventDefault();
                            handleDelete(dt._id);
                        }} className='text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Delete</button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
        </TableFooter>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add Category</ModalHeader>
        <ModalBody>

        <Label>
          <span>Category</span>
          <Input className="mt-1" type="text" placeholder="Category" onChange={e => setCategory(e.target.value)} required/>
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
        <ModalHeader>Edit Category</ModalHeader>
        <ModalBody>

        <Label>
          <span>Category</span>
          <Input className="mt-1" type="text" placeholder="category" value={category} onChange={e => setCategory(e.target.value)} required/>
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

    </div>
  )
}

export default ManageCategories
