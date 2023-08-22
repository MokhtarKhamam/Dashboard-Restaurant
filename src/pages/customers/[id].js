import { Box, Container, Stack } from '@mui/system';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const CustomerDetails = () => {
  const router = useRouter();
  const {id} = router.query

  const {stateData} = useAuth();

  console.log(id)

  const [customerDetails, setCustomerDetails] = useState([])
  const [user, setUser] = useState({})
  const [totalPrice, setTotalPrice] = useState("")

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_URL}user_reservation`, {user_id: id, id: stateData.user.shop}, 
    {
      headers: {
        Authorization: `Bearer ${stateData.token}`
      }
    })
    .then(res => {
      console.log(res.data)
      setCustomerDetails(res.data.data)
      setUser(res.data.user)
      setTotalPrice(res.data.total_price)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <>
      <Head>
        <title>Customers Details| Devias Kit</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3} direction="row" sx={{justifyContent: "space-between"}}>
              <Typography variant='h6'>Name : {user && user.name}</Typography>
              <Typography variant='h6'>phone : {user && user.phone}</Typography>
              <Typography variant='h6'>Total Price : {totalPrice && totalPrice}</Typography>
          </Stack>
          {
            customerDetails.map((element, index) => (
              <div key={index}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date: {element.date}</TableCell>
                      <TableCell>Time: {element.time}</TableCell>
                      <TableCell>Occasion: {element.occasion ? element.occasion : "No Occasion"}</TableCell>
                      <TableCell>Status: {element.status}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableRow>
                    <TableCell>Note: {element.note ? element.note : "No Note"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total price: {element.price ? element.price : "No Order"}</TableCell>
                  </TableRow>
                </Table>
                <div key={index} style={{marginBottom: "100px", display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", flexWrap: "wrap"}}>
                {
                  element.order.length ? 
                  element.order.map((order, index) => (
                          <Card sx={{ width: 345 }} key={index}>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="140"
                                image={`${process.env.REACT_APP_API_URL_IMAGE}${order.main_image}`}
                                alt="green iguana"
                              />
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                  Lizard
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Lizards are a widespread group of squamate reptiles, with over 6,000
                                  species, ranging across all continents except Antarctica
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                            <CardActions>
                              <Button size="small" color="primary">
                                Share
                              </Button>
                            </CardActions>
                          </Card>
                  ))
                  :
                  <TableRow>
                    <TableCell sx={{color: "red"}}>No Order In This Reservation</TableCell>
                  </TableRow>
                }
                </div>
              </div>
            ))
          }
        </Container>
      </Box>
    </>
  )
}

CustomerDetails.getLayout = (CustomerDetails) => (
  <DashboardLayout>
    {CustomerDetails}
  </DashboardLayout>
);

export default CustomerDetails;
