import React,{useState} from "react";
import { makeStyles } from '@mui/styles';
import Drawer from "@mui/material/Drawer";
import { Avatar, Button } from "@mui/material";
import { CryptoState } from "../../CryptoContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from '../Banner/Carousel';
import { AiFillDelete } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import {  Typography, Box, Modal, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';



const useStyles = makeStyles({
    container: {
      width: 350,
      padding: 25,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "monospace",
      backgroundColor: "#121212", 
      color: "#CFB53B",            
    },
    profile: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      height: "100%",
      color: "#CFB53B", 

    },
    logout: {
      height: "8%",
      width: "100%",
      backgroundColor: "#CFB53B", 
      color: "#121212",           
      marginTop: 20,
    },
    picture: {
      width: 200,
      height: 200,
      cursor: "pointer",
      backgroundColor: "#CFB53B", 
      objectFit: "contain",
    },
    watchlist: {
      flex: 1,
      width: "100%",
      backgroundColor: "#1E1E1E", 
      borderRadius: 10,
      padding: 15,
      paddingTop: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      overflowY: "scroll",
      '&::-webkit-scrollbar': {
      width: '8px',              
    },
    },
    coin: {
      padding: 10,
      borderRadius: 5,
      color: "#121212",            
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#CFB53B",  
      boxShadow: "0 0 3px #CFB53B", 
    },
  });

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const { user, setAlert, watchlist, coins, symbol ,transferHistory} = CryptoState();

  console.log(watchlist, coins);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const [modalOpen, setModalOpen] = useState(false);

  // const transferHistory = [
  //   {
  //       date: '2024-08-18T12:34:56Z',
  //       tokenAddress: '0x123456789...',
  //       recipientAddress: '0x987654321...',
  //       amount: 10,
  //       transactionHash: '0xabcdef...',
  //   },
  //   {
  //       date: '2024-08-18T12:34:56Z',
  //       tokenAddress: '0x123456789...',
  //       recipientAddress: '0x987654321...',
  //       amount: 10,
  //       transactionHash: '0xabcdef...',
  //   },
  //   // for demo
  // ];

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !",
    });

    toggleDrawer();
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  style={{cursor: "pointer", scale: 1.5 , marginTop: 10 , marginBottom: 10 , borderRadius: 50, boxShadow: "0 0 3px #CFB53B" , backgroundColor: "#CFB53B", objectFit: "contain", width: 80, height: 80}}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <Button
                
                                variant="contained"
                                color="primary"
                                onClick={() => setModalOpen(true)}
                                style={{
                                    backgroundColor: "#DDA0DD", 
                                    color: "black",          
                                    marginTop: "20px",         
                                }}
                            >
                                View Transfer History
                            </Button>

                            <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          width: { xs: '90%', sm: '80%', md: '70%' }, // Responsive width
          maxWidth: 800, // Max width for larger screens
          margin: 'auto',
          marginTop: { xs: '20%', sm: '10%' }, // Responsive top margin
          backgroundColor: '#1E1E1E', // Dark background color
          padding: 4,
          borderRadius: 2,
          color: '#CFB53B',
          overflow: 'auto' // Allows scrolling if content overflows
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          id="modal-title"
          style={{ color: '#CFB53B' }}
        >
          Transfer History
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#CFB53B' }}>Date</TableCell>
              <TableCell style={{ color: '#CFB53B' }}>Token Address</TableCell>
              <TableCell style={{ color: '#CFB53B' }}>Recipient</TableCell>
              <TableCell style={{ color: '#CFB53B' }}>Amount</TableCell>
              <TableCell style={{ color: '#CFB53B' }}>Transaction Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transferHistory.map((history, index) => (
              <TableRow key={index}>
                <TableCell style={{ color: '#FFFFFF' }}>{new Date(history.date).toLocaleString()}</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>{history.tokenAddress}</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>{history.recipientAddress}</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>{history.amount}</TableCell>
                <TableCell style={{ color: '#FFFFFF' }}>
                  <a
                    href={`https://etherscan.io/tx/${history.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#CFB53B' }}
                  >
                    View on Etherscan
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>

                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div className={classes.coin}>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    else return <></>;
                  })}
                </div>
              </div>
              <Button
  variant="contained"
  className={classes.logout}
  onClick={logOut}
  style={{
    backgroundColor: "#1f1f1f", 
    color: "#EEBC1D",            
    borderRadius: "5px",         
    boxShadow: "0px 4px 15px rgba(238, 188, 29, 0.5)", 
    transition: "0.3s ease",     
    padding: "10px 20px",        
    fontSize: "16px",            
  }}
>
  Log Out
</Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}