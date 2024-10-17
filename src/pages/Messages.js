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
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { AuthContext } from '../context/AuthContext';

function Messages() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useContext(AuthContext);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/messages`,{
          headers: {
            'Authorization':`Bearer ${token}`
          }
        })
        .then( data => data.json())
        .then( data => {
            setData(data)
            setLoading(false);
        } )
        .catch( err => { console.log(err) })
      },[])

  return (
    <div>
        <PageTitle>Messages</PageTitle>

        <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name & Email</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            data.length === 0 ? <TableCell>No Records</TableCell> :
            
            data.map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                    <span className="text-sm capitalize">{dt.name}</span>
                    <br />
                    <span className="text-xs">{dt.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{dt.message}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs">{dt.date}</span>
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

export default Messages