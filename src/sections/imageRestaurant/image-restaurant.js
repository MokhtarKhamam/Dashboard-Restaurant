import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import axios from 'axios';

export const ImageRestaurant = (props) => {
  const { image, onDeleteImage } = props;

  const handleDeleteImage = () => {
    onDeleteImage(image.id);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: 375
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="240"
          image={`${process.env.REACT_APP_API_URL_IMAGE}${image.URL}`}
          alt="green iguana"
        />
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={handleDeleteImage}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

ImageRestaurant.propTypes = {
  image: PropTypes.object.isRequired,
  onDeleteImage: PropTypes.func.isRequired
};