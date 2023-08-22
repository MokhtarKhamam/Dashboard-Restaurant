import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, Card, CardActions, CardContent, Dialog, Divider, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';


export const AccountProfile = ({handleFileChange, selectedFile, userData, setUserData}) => {
  const { stateData } = useAuth();

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}show_shop/${stateData.user.shop}`)
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Avatar
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile) 
                  : userData && userData.main_image
                  ? `${process.env.REACT_APP_API_URL_IMAGE}${userData.main_image}`
                  : undefined
              }
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
            />
            <Typography gutterBottom variant="h5">
              {stateData.user.name}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <label htmlFor="file" style={{ margin: 'auto' }}>
            <Button fullWidth variant="text" onClick={handleButtonClick}>
              Upload picture
            </Button>
          </label>
          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </CardActions>
      </Card>
    </>
  );
};