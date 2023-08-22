import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Container, Stack } from "@mui/system";
import { Button, Grid, Pagination, SvgIcon, Typography } from "@mui/material";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { CompaniesSearch } from "src/sections/companies/companies-search";
import { CompanyCard } from "src/sections/companies/company-card";
import { ImageRestaurant } from "src/sections/imageRestaurant/image-restaurant";
import SkeletonImageRestaurant from "src/utils/skeleton-image-resturant";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const {stateData} = useAuth();
  // fetch image data
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}show_shop_image/${stateData.user.shop}`)
      .then((response) => {
        setImageData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleDeleteImage = (id) => {
    console.log(id)
    axios
      .post(`${process.env.REACT_APP_API_URL}delete_shop_image`, {
        id: id,
      })
      .then((res) => {
        // Update the imageData state after successful deletion
        const updatedImageData = imageData.filter((image) => image.id !== id);
        setImageData(updatedImageData);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setLoading(true);
    const selectedFile = e.target.files[0];

    const formData = new FormData();
    formData.append("id", stateData.user.id);
    formData.append("image", selectedFile);

    axios
      .post(`${process.env.REACT_APP_API_URL}add_shop_image`, formData, {})
      .then((res) => {
        //if add success then reload new data
        if (res.data.status) {
          axios
            .get(`${process.env.REACT_APP_API_URL}show_shop_image/${stateData.user.shop}`)
            .then((response) => {
              setImageData(response.data.data);
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = imageData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Head>
        <title>Image | Devias Kit</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Image</Typography>
              </Stack>
              <div>
                <label htmlFor="file">
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={handleButtonClick}
                  >
                    Add
                  </Button>
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </Stack>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "30px",
              }}
            >
              {!loading ? (
                currentItems.map((image) => (
                  <ImageRestaurant key={image.id} image={image} onDeleteImage={handleDeleteImage} />
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "30px",
                  }}
                >
                  {[1, 2, 3, 4].map((skeleton) => (
                    <SkeletonImageRestaurant key={skeleton} />
                  ))}
                </div>
              )}
            </div>
            <Grid container spacing={3}></Grid>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(imageData.length / itemsPerPage)}
                size="small"
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
