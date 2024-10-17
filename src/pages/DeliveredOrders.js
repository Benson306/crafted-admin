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
import { EditIcon, TrashIcon } from '../icons'

import response from '../utils/demo/tableData'
import { AuthContext } from '../context/AuthContext'
import useAuthCheck from '../utils/useAuthCheck'
// make a copy of the data, for the second table
const response2 = response.concat([])

function Tables() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  useAuthCheck();

  // setup data for every table
  const [loading, setLoading] = useState(true)

  // pagination setup
  const resultsPerPage = 10

  const [totalResults, setTotalResults] = useState(0);

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
  }
  // on page change, load new sliced data
  // here you would make another server request for new data
  // useEffect(() => {
    

  // }, [pageTable])

  const { token } = useContext(AuthContext);

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/GetDeliveredOrders`,{
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token}`
      }
    })
    .then( data => data.json())
    .then( data => { 
      //setDeliveredOrders(data);

      Promise.all(
        data.map(order =>
          fetch(`${process.env.REACT_APP_API_URL}/get_location/${order.deliveryLocation}`,{
            method: 'GET',
            headers: {
              'Authorization':`Bearer ${token}`
            }
          })
            .then(response => response.json())
            .then(location => ({ ...order, deliveryLocation: location.town  }))
        )
      ).then(ordersWithData => {
        // setTotalResults(ordersWithData.length);
        setData(ordersWithData)
        setLoading(false);
      });
    })
    .catch( err => { console.log(err) })
  },[])


  return (
    <>
      <PageTitle>Delivered Orders</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client Details</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Delivery Location & Cost</TableCell>
              <TableCell>Items Cost</TableCell>
              <TableCell>Total Cost</TableCell>
              {/* <TableCell>Amount Paid</TableCell> */}
              <TableCell>Order Date</TableCell>
              <TableCell>Delivery Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            data.length === 0 ? <TableCell>No Records</TableCell> :
            
            data.reverse().map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User avatar" /> */}
                    <div>
                      <p className="font-semibold">{dt.first_name} {dt.second_name}</p>
                      <p className="text-sm">{dt.email}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{dt.phone_number}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center text-sm">
                        <div>
                        {
                          dt.items.map( item => 
                            <div className='mb-1 border-b p-2'>
                              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{item.type} - <b>{item.productName || item.title}</b> X {item.quantity} </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{item.owner_first_name} {item.owner_second_name} - {item.owner_phone_number}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{item.owner_email }</p>
                            </div>
                          )
                        }
                        
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{dt.deliveryLocation}</div>
                  <div className="text-xs">Ksh. { dt.delivery_cost }</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">Ksh. {Math.floor(dt.total_price) }</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">Ksh. {Math.floor(dt.total_price) +  dt.delivery_cost}</span>
                </TableCell>
                {/* <TableCell>
                  <span className="text-sm">
                    Ksh.
                    { 
                      dt.amount_paid ? 
                      <span>{dt.amount_paid}</span>
                      :
                      <span>{Math.floor(dt.total_price) +  dt.delivery_cost}</span> 
                    }
                  </span>
                </TableCell> */}
                <TableCell>
                  <span className="text-sm">{ dt.order_date }</span>
                </TableCell>
                <TableCell>
                <span className="text-sm">{ dt.delivery_date }</span>
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

export default Tables
