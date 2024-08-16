import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { CryptoState } from '../CryptoContext';
import { makeStyles } from '@mui/styles';
import { LinearProgress, Typography, Box } from '@mui/material';
import parse from 'html-react-parser';
import { numberWithCommas } from '../Components/Banner/Carousel';
import CoinInfo from '../Components/CoinInfo'; 

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: '20px',
    gap: '40px', 
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px', 
    },
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#1a1a1d', 
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: 'none',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Montserrat',
    color: '#f5f5f5', 
  },
  description: {
    width: '100%',
    fontFamily: 'Montserrat',
    padding: 15,
    textAlign: 'justify',
    color: '#b0b0b0', 
  },
  marketData: {
    alignSelf: 'start',
    padding: 15,
    width: '100%',
    borderTop: '1px solid gray',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'space-around',
      borderTop: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  marketDataItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: '#f5f5f5', 
  },
  nsymbol: {
    color: 'gold', 
  },

}));

const Coinpage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error('Error fetching coin:', error);
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [currency]);

  const classes = useStyles();
  if (!coin) return <LinearProgress style={{ backgroundColor: 'gold' }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h4" className={classes.heading}>
          {coin?.name} 
          <span className={classes.nsymbol}>({coin?.symbol.toUpperCase()})</span>
        </Typography>
        <Typography className={classes.description}>
          {parse(coin?.description.en.split('. ')[0])}.
        </Typography>
        <div className={classes.marketData}>
          <Box className={classes.marketDataItem}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            <Typography variant="h5" className={classes.nsymbol}>
              {coin?.market_cap_rank}
            </Typography>
          </Box>
          <Box className={classes.marketDataItem}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            <Typography variant="h5" className={classes.nsymbol}>
              {symbol}{' '}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </Box>
          <Box className={classes.marketDataItem}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            <Typography variant="h5" className={classes.nsymbol}>
              {symbol}{' '}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </Box>
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default Coinpage;
