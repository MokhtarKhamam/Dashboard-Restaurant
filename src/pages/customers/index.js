import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { subDays, subHours } from 'date-fns';
import { Avatar, Box, Card, CircularProgress, Container, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const basUrl = process.env.REACT_APP_API_URL;

const Page = () => {
  const router = useRouter()
  const { stateData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customers, setCustomers] = useState([]);

  // state for search
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };



  useEffect(() => {
      console.log("hi")
      setIsLoading(true);
      axios
        .post(
          `${basUrl}search_user`,
          { id: stateData.user.shop, search },
          {
            headers: {
              Authorization: `Bearer ${stateData.token}`,
            },
          }
        )
        .then((res) => {
          setIsLoading(false);
          setCustomers(res.data.data);
          if(res.data.data.length === 0){
            setErrMsg("No Resault Matches")
          }else{setErrMsg("")}
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
  }, [search]);



  useEffect(() => {
    axios
      .post(
        `${basUrl}shop_customers`,
        { id: stateData.user.shop },
        {
          headers: {
            Authorization: `Bearer ${stateData.token}`,
          },
        }
      )
      .then((res) => {
        setCustomers(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [userDetails, setUserDetails] = useState([])
  const [totalPrice, setTotalPrice] = useState("")
  const [openDetails, setOpenDetails] = useState(false)

  const handleTableClick = (id) => {
    router.push(`/customers/${id}`)
  }

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  }, []);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCustomers = customers.length && customers.slice(startIndex, endIndex);

  console.log(totalPrice)
  console.log(userDetails)


  return (
    <>
      <Head>
        <title>Customers | Devias Kit</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">Customers</Typography>
            </Stack>
            <CustomersSearch handleSearch={handleSearch} />
            {isLoading && <CircularProgress />}
            {errMsg && (
              <Typography variant="body1" sx={{ color: "red" }}>
                {errMsg}
              </Typography>
            )}
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Last Reservation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedCustomers.length &&
                        paginatedCustomers.map((customer) => {
                          return (
                            <>
                              <TableRow hover key={customer.id} onClick={() => handleTableClick(customer.id)}>
                                <TableCell>
                                  <Stack alignItems="center" direction="row" spacing={2}>
                                    <Avatar src={customer.avatar}>
                                      <img
                                        src={`${process.env.REACT_APP_API_URL_IMAGE}${customer.image}`}
                                        alt=""
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "cover",
                                          borderRadius: "50%",
                                        }}
                                      />
                                    </Avatar>
                                    <Typography variant="subtitle2">{customer.name}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.last_reservation}</TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>
                </Box>
              </Scrollbar>
              <TablePagination
                component="div"
                count={customers.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
