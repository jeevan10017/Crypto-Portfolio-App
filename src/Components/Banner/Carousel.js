import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { TrendingCoins } from '../../config/api';
import axios from 'axios';
import { CryptoState } from '../../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const useStyles = makeStyles((theme) => ({
  Carousel: {
    height: '50%',
    display: 'flex',
    alignItems: 'center',
    margin:"20px",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const Carousel = () => {
  const classes = useStyles();
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();
  const API_KEY = process.env.API_KEY;

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency), {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
        },
      });
      setTrending(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;
    return (
      <div className={classes.carouselItem} key={coin.id}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </div>
    );
  });

  const responsive = {
    0: { items: 1 },
    512: { items: 4 },
  };

  return (
    <div className={classes.Carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        autoPlay
        disableButtonsControls
        disableDotsControls
        responsive={responsive}
        items={items} 
      />
    </div>
  );
};

export default Carousel;
