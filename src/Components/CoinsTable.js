import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from './Banner/Carousel';
import { makeStyles } from '@mui/styles';
import { Pagination } from '@mui/material';
import { Container, Typography, ThemeProvider, createTheme, TextField, TableContainer, LinearProgress, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';

const useStyles = makeStyles(() => ({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "#CFB53B",
        },
        "& .MuiPaginationItem-page.Mui-selected": {
            backgroundColor: "#CFB53B",
        },
    }
}));

const CoinsTable = () => {

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const { currency, symbol, coins, loading, fetchCoins, error } = CryptoState();  

    useEffect(() => {
        if (coins.length === 0 && !loading) {
            fetchCoins();
        }
    }, [currency, coins, loading, fetchCoins]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            mode: 'dark',
        },
    });

    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    };

    const classes = useStyles();

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center", marginTop: "5%", zIndex: 10 }}>
                <Typography
                    variant='h4'
                    style={{ margin: 18, fontFamily: "Montserrat" }}
                >
                    Cryptocurrency Prices by Market Cap
                </Typography>
                <TextField
                    label="Search for Cryptocurrency..."
                    variant='outlined'
                    style={{ marginBottom: 20, width: "100%" }}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {error ? (  // Check if there is an error
                    <Typography variant="h6" style={{ color: 'red', marginBottom: 20 }}>
                        {error}
                    </Typography>
                ) : (
                    <TableContainer>
                        {loading ? (
                            <LinearProgress style={{ backgroundColor: "#CFB53B" }} />
                        ) : (
                            <Table>
                                <TableHead style={{ backgroundColor: "#CFB53B" }}>
                                    <TableRow>
                                        {["Coin", "Price", "24hr Change", "Market Cap"].map((head) => (
                                            <TableCell
                                                style={{
                                                    color: "black",
                                                    fontWeight: "700",
                                                    fontSize: "20px",
                                                    fontFamily: "Montserrat",
                                                }}
                                                key={head}
                                                align={head === 'Coin' ? "left" : "right"}
                                            >
                                                {head}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {handleSearch()
                                        .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                        .map((row) => {
                                            const profit = row.price_change_percentage_24h > 0;
                                            return (
                                                <TableRow
                                                    onClick={() => navigate(`/coins/${row.id}`)}
                                                    key={row.id}
                                                    className={classes.row}
                                                >
                                                    <TableCell component='th' scope='row'
                                                        style={{
                                                            display: "flex",
                                                            gap: 15,
                                                        }}
                                                    >
                                                        <img
                                                            src={row?.image}
                                                            alt={row.name}
                                                            height="50"
                                                            style={{ marginBottom: 10 }}
                                                        />
                                                        <div
                                                            style={{ display: 'flex', flexDirection: 'column' }}
                                                        >
                                                            <span
                                                                style={{
                                                                    textTransform: "uppercase",
                                                                    fontSize: 22,
                                                                }}
                                                            >
                                                                {row.symbol}
                                                            </span>

                                                            <span style={{ color: 'darkgray' }}>{row.name}</span>
                                                        </div>

                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {symbol}{" "}
                                                        {numberWithCommas(row.current_price.toFixed(2))}
                                                    </TableCell>
                                                    <TableCell align="right" style={{ color: profit ? "green" : "red", fontWeight: 500 }}>
                                                        {profit && "+"}
                                                        {row.price_change_percentage_24h.toFixed(2)}%
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {symbol}{" "}
                                                        {numberWithCommas(
                                                            row.market_cap.toString().slice(0, -6)
                                                        )}
                                                        M
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                )}
                <Pagination
                    style={{
                        margin: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    classes={{ ul: classes.pagination }}
                    color='primary'
                    count={Math.ceil(handleSearch().length / 10)}
                    page={page}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scroll(0, 450);
                    }}
                />
            </Container>
        </ThemeProvider>
    );
};

export default CoinsTable;
