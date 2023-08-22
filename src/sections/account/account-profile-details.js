import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Dialog,
  Typography,
} from '@mui/material';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { success } from 'src/theme/colors';
import { green } from '@mui/material/colors';
import { LoadingButton } from '@mui/lab';


export const AccountProfileDetails = ({ selectedFile }) => {

  const {stateData} = useAuth();

  const [values, setValues] = useState(
    {
    id: "",
    name: "",
    phone: "",
    bio: "",
    description: "",
    city: "",
    address: [{
      lat:"",
      long: "",
    }],
    tags: [
      { id: "", tag: "" },
      { id: "", tag: "" },
      { id: "", tag: "" }
    ]
  }
  );



  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}show_shop/${stateData.user.shop}`)
    .then(res => {
      const value = res.data.data;
      setValues({
        id: value.id,
        name: value.name,
        phone: value.phone,
        bio: value.bio,
        description: value.description,
        city: value.city_id,
        address: [{
          lat: value.address[0].lat,
          long: value.address[0].long,
        }],
        tags: [
          { id: value.Tags[0].id, tag: value.Tags[0].tag },
          { id: value.Tags[1].id, tag: value.Tags[1].tag },
          { id: value.Tags[2].id, tag: value.Tags[2].tag }
        ]
      });
    })
    .catch(error => {
      console.log(error);
    });
  }, []);


  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    if (name.startsWith("tag_")) {
      const tagIndex = parseInt(name.split("_")[1], 10) - 1;
      setValues((prevState) => {
        const tags = [...prevState.tags];
        tags[tagIndex].tag = value;
        return { ...prevState, tags };
      });
    } else {
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  }, []);


  const handleSelectChange = (e) => { 
    setValues((prevState) => {
      return {...prevState, city: e.target.value}
    })
  }


const handleSubmit = (e) => {
  e.preventDefault();
  let formData = new FormData();
  formData.append("id", values.id);
  formData.append("phone", values.phone)
  formData.append("description", values.description)
  formData.append("bio", values.bio)
  formData.append("city_id", values.city);
  formData.append("name", values.name);
  formData.append("tags", JSON.stringify(values.tags)); // Convert the tags array to a JSON string
  formData.append("address", JSON.stringify(values.address)); // Convert the tags array to a JSON string
  if (selectedFile) {
    formData.append("main_image", selectedFile);
  }

  // Log the contents of the formData object
  for (const pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  setLoadingButton(true)

  axios.post(`${process.env.REACT_APP_API_URL}update_my_shop`, formData, 
  {
    headers: {
      Authorization: `Bearer ${stateData.token}`
    }
  })
  .then(res => {
    console.log(res)
    setLoadingButton(false)
    setMessageSuccess("Your data has updated successfully!")
  })
  .catch(error => {
    console.log(error)
    setLoadingButton(false)
    setMessageSuccess("Connection Failed")
  })
};


  const [cities, setCities] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}cities`)
    .then(res => {
      setCities(res.data.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])





  //location 

  const [location, setLocation] = useState(null);

  const [message, setMessage] = useState("")





  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValues((prevState) => ({
            ...prevState,
            address: [{ lat: latitude, long: longitude }]
          }));
          setLocation({ latitude, longitude });
          setOpen(false)
          setMessage("Your location has updated successfully!")
        },
        (error) => {
          console.log(error);
        }
      );

    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };


  //dialog material ui
  const [open, setOpen] = useState(false)

  //loading button 
  const [loadingButton, setLoadingButton] = useState(false)
  const [messageSuccess, setMessageSuccess] = useState("")



  return (
    <>
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    helperText="Please specify restaurant name"
                    label="Restaurant Name"
                    name="name"
                    onChange={handleChange}
                    required
                    value={values.name}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    onChange={handleChange}
                    required
                    value={values.phone}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    onChange={handleChange}
                    required
                    value={values.bio}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Description"
                    name="discription"
                    onChange={handleChange}
                    type="text"
                    value={values.description}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                    <TextField
                    fullWidth
                    label="Select City"
                    name="state"
                    onChange={handleSelectChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.city}
                  >
                    {cities.map((city) => (
                      <option
                        key={city.id}
                        value={city.id}
                      >
                        {city.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                <TextField
                    fullWidth
                    label="Tag 1"
                    name="tag_1"
                    onChange={handleChange}
                    type="text"
                    value={values.tags[0].tag}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                <TextField
                    fullWidth
                    label="Tag 2"
                    name="tag_2"
                    onChange={handleChange}
                    type="text"
                    value={values.tags[1].tag}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                <TextField
                    fullWidth
                    label="Tag 3"
                    name="tag_3"
                    onChange={handleChange}
                    type="text"
                    value={values.tags[2].tag}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <Button variant='contained' 
                  // onClick={handleLocation}
                  onClick={() => setOpen(true)}
                  >Set New Location</Button>
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  {
                    message &&
                    <Typography variant='h6' sx={{color: "green"}}>{message}</Typography>
                  }
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <LoadingButton variant="contained" loading={loadingButton} type='submit' loadingPosition='center'>
              Save details
            </LoadingButton>
          </CardActions>
          {
            messageSuccess &&
            <CardContent>
              <Typography variant='h6' sx={{ color: messageSuccess === "Connection Failed" ? "red" : "green" }}>{messageSuccess}</Typography>
            </CardContent>
          }
        </Card>
      </form>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ borderRadius: "20px", padding: "30px", textAlign: "center"}}>
          <Typography variant='h6' sx={{color: "red", textAlign: "center"}}>Are you sure you need to reset your restaurant ?</Typography>
          <Button variant='contained' sx={{margin: "auto", marginTop: "30px"}} onClick={handleLocation} >I am sure</Button>
        </Box>
      </Dialog>

    </>
  );
};