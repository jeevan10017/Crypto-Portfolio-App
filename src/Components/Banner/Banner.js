import React from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Typography } from '@mui/material';
import backgroundImg from '../../assets/newbg.jpg';
import Corousel from './Corousel';

const useStyles = makeStyles(() => ({
  banner: {
    backgroundImage: `url(${backgroundImg})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    height: 400, 
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
    
  },
    tagline: {
        display: 'flex',
        height: '40%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const Banner = () => {
  const classes = useStyles();

  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
            <Typography variant='h4' style={{color: 'white', fontWeight: 'bold' ,marginBottom:"15" , fontFamily:"Montserrat"}}>
                Welcome to Crypto Portfolio
            </Typography>
            <Typography variant='subtitle2' style={{color: 'white', fontFamily:"Montserrat"}}>
                Keep track of your favorite cryptocurrencies
            </Typography>
        </div>
        <Corousel/>
      </Container>
    </div>
  );
};

export default Banner;
