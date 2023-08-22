import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Dialog, DialogTitle, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
const now = new Date();
const basUrl = process.env.REACT_APP_API_URL






const Page = () => {
  // import global state 
    const {stateData} = useAuth();

  const [showInfo, setShowInfo] = useState({})

  useEffect(() => {
    axios.post(`${basUrl}show_info`, {id: stateData.user.shop}, 
    {
      headers: {
        Authorization: `Bearer ${stateData.token}`
      }
    })
    .then(res => {
      setShowInfo(res.data.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, []);



  
  //fetch latest order
  const [latestOrder, setLatestOrder] = useState([])

  useEffect(() => {
    axios.post(`${basUrl}show_reservations_shop`, 
    {
      id: stateData.user.shop
    }, 
    {
      headers: {
        Authorization: `Bearer ${stateData.token}`
      }
    })
    .then(res => {
      setLatestOrder(res.data.data)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  //fetch most order
  const [mostOrder, setMostOrder] = useState([])

  useEffect(() => {
    axios.post(`${basUrl}most_order`, {id: stateData.user.shop},
    {
      headers: {
        Authorization: `Bearer ${stateData.token}`
      }
    }).then(res => {
      setMostOrder(res.data.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, []) 

  const [chartSeries, setChartSeries] = useState([])
  const [labels, setLabels] = useState([])

  useEffect(() => {
    axios.post(`${basUrl}Ratio`, {id: stateData.user.shop}, 
    {
      headers: {
        Authorization: `Bearer ${stateData.token}`
      }
    })
    .then(res => {
      setChartSeries(res.data.chartSeries)
      setLabels(res.data.labels)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  const [chart, setChart] = useState([])

  useEffect(() => {
    axios.post(`${basUrl}chart`, {id: stateData.user.shop}, 
    {
      headers: {
        Authorization: `Bearer ${stateData.token}`
      }
    })
    .then(res => {
      setChart(res.data.chartSeries.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  return(
  <>
    <Head>
      <title>
        Overview | Devias Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewBudget
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={showInfo && showInfo.total_price }
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value={showInfo && showInfo.customer_count}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTasksProgress
              sx={{ height: '100%' }}
              value={showInfo.order}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value={showInfo && showInfo.reservation}
            />
          </Grid>
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'Requests Number',
                  // data: [0, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                  data: chart && chart
                },
                {
                  name: 'Last year',
                  // data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={chartSeries}
              labels={labels}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewLatestProducts
            products={mostOrder}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestOrders
            orders={latestOrder}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
