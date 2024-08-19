import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { Tab, Tabs, AppBar, Box } from "@mui/material";
import Signup from "./Signup";
import Login from "./Login";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    color: "white",
    borderRadius: 10,
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
    fontSize: 20,
  },
}));

export default function AuthModal({ triggerOpen, handleClose }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { setAlert } = CryptoState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: "success",
        });
        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={triggerOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={triggerOpen}>
        <div className={classes.paper}>
          <AppBar
            position="static"
            style={{
              backgroundColor: "transparent",
              color: "white",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              style={{ borderRadius: 10 }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
          </AppBar>
          {value === 0 && <Login handleClose={handleClose} />}
          {value === 1 && <Signup handleClose={handleClose} />}
          <Box className={classes.google}>
            <span>OR</span>
            <GoogleButton
              style={{ width: "100%", outline: "none", cursor: "pointer", zIndex: 10 }}
              onClick={signInWithGoogle}
            />
          </Box>
        </div>
      </Fade>
    </Modal>
  );
}
