import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Container, Typography } from '@mui/material';
import backgroundImg from '../../assets/newbg.jpg';
import Carousel from './Carousel';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  banner: {
    backgroundImage: `url(${backgroundImg})`, 
    zIndex: -1,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    height: 450, 
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 25,
    justifyContent: 'space-around',

  },
  bannerContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 25,
    justifyContent: 'space-around',
    zIndex: 1,
    
  },
    tagline: {
        display: 'flex',
        height: '40%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    overlay: {
      position: 'absolute',
      top:"8.8%",
      left: 0,
      width: '100%',
      height: "66%", 
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 0,
      borderRadius: '10px',
      '@media (max-width: 768px)': {
        height: '75%', 
      },
      '@media (max-width: 440px)': {
        height: '75%', 
      },
    },
   new: {
    zIndex: 100
   }
}));

const Banner = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.banner}>
       <div className={classes.overlay} />
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
            <Typography variant='h3' style={{color: 'white', fontWeight: 'bold' ,marginBottom:"15" , fontFamily:"Montserrat"}}>
                Welcome to Crypto Portfolio
            </Typography>
            <Typography className={classes.new} variant='h6' style={{color: 'white', fontFamily:"Montserrat" }}>
                Keep track of your favorite cryptocurrencies
            </Typography>
            <Button variant='contained'onClick={() => navigate("/tokens")} style={{backgroundColor: '#EEBC1D', color: 'black', marginTop: 25 ,marginTop:5,marginBottom:8 }}>
                manage Tokens
            </Button>
        </div>
        <Carousel/>
      </Container>
    </div>
  );
};

export default Banner;
