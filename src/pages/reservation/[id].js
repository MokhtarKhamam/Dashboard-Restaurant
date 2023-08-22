import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from 'axios';
import { Box, Stack } from '@mui/system';
import { Card, CardActionArea, CardContent, CardMedia, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { useAuth } from 'src/hooks/use-auth';

const basUrl = process.env.REACT_APP_API_URL

const Page = () => {
  const router = useRouter();
  const {id} = router.query
  const {stateData} = useAuth()


  const [reservationDetails, setReservationDetails] = useState([])

  useEffect(() => {
    axios.post(`${basUrl}reservation_details`, {id: id}, 
    {
      headers : {
        Authorization: `Bearer ${stateData.token}`
      }
    })
    .then(res => {
      setReservationDetails(res.data.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])


  const statusMap = {
    pending: 'warning',
    delivered: 'success',
    refunded: 'error'
  };

  return (
    <>
        <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Number Of People
              </TableCell>
              <TableCell>
                Ocassion
              </TableCell>
              <TableCell sortDirection="desc">
                Date
              </TableCell>
              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              reservationDetails &&
                <TableRow
                  hover
                >
                  <TableCell>
                    {reservationDetails.user_name}
                  </TableCell>
                  <TableCell>
                    {reservationDetails.guests_count}
                  </TableCell>
                  <TableCell>
                    {reservationDetails.occasion ? reservationDetails.occasion : "No Occasion"}
                  </TableCell>
                  <TableCell>
                    {reservationDetails.date}
                  </TableCell>
                  <TableCell>
                    <SeverityPill color={statusMap[reservationDetails.status]}>
                      {reservationDetails.status}
                    </SeverityPill>
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </Box>
      {
        reservationDetails &&
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", flexWrap: "wrap", padding: "30px"}}>
          {
          reservationDetails.order && reservationDetails.order.map((element, index) => (
            <Card sx={{ width: 345 }} key={index}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="240"
                image={element.main_image}
                alt="green iguana"
              />
              <CardContent>
                <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                  <Typography gutterBottom variant="h5" component="div">
                    {element.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {element.total_price}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                  <Typography gutterBottom variant="h5" component="div">
                    Count : {element.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size : {element.size}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
            ))
          }
      </div>
      }
    </>
  )
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
