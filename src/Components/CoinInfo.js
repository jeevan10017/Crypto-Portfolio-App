import React, { useEffect, useState } from 'react';
import { CircularProgress, createTheme, ThemeProvider, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { HistoricalChart } from '../config/api';
import { chartDays } from '../config/constants';
import SelectButton from './SelectButton';
import { CryptoState } from '../CryptoContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);
  const [flag, setFlag] = useState(false);
  const [percentageChange, setPercentageChange] = useState(0);
  const [color, setColor] = useState('#EEBC1D');
  const [errorMessage, setErrorMessage] = useState("");

  const { currency } = CryptoState();
  const classes = useStyles();

  const fetchHistoricalData = async () => {
    try {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setFlag(true);
      setHistoricalData(data.prices);
      const startPrice = data.prices[0][1];
      const endPrice = data.prices[data.prices.length - 1][1];
      const change = ((endPrice - startPrice) / startPrice) * 100;

      setPercentageChange(change.toFixed(2));

      setColor(change > 0 ? 'green' : 'red');
    } catch (error) {
      if (error.response) {
        console.error("API responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("API request was made but no response received:", error.request);
      } else {
        console.error("Error setting up API request:", error.message);
      }

      if (error.message === 'Network Error' || error.response?.status === 429) {
        setFlag(false); 
        setHistoricalData(null); 
        setErrorMessage("Free API limit is exceeded, come back in 30 seconds or wait for 30 seconds.");
      }
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [days, currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicalData && flag === false && errorMessage ? (
          <Typography variant="h6" style={{ color: 'red', marginBottom: 20, textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        ) : !historicalData || flag === false ? (
          <CircularProgress style={{ color: '#CFB53B' }} size={250} thickness={1} />
        ) : (
          <>
            <Typography variant="h5" style={{ color, marginBottom: 20 }}>
              {`Change: ${percentageChange}%`}
            </Typography>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: color,
                    backgroundColor: (context) => {
                      const chart = context.chart;
                      const { ctx, chartArea } = chart;

                      if (!chartArea) {
                        return null;
                      }

                      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                      gradient.addColorStop(0, color === 'green' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)');
                      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
                      return gradient;
                    },
                    fill: true,
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
               
              }}
            />
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
