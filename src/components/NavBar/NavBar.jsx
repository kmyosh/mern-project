import React from "react";
import { Link } from "react-router-dom";
import * as userService from "../../utilities/UserRequests/users-service";
import { AppBar } from "@mui/material";
import Button from "@mui/material/Button";

export default function NavBar(props) {
  function handleLogOut() {
    userService.logOut();
    props.setUser(null);
  }
  return (
    <AppBar
      boxShadow="none"
      position="static"
      color="transparent"
      sx={{ zIndex: "0" }}
    >
      <nav style={{ border: "1px solid blue" }}>
        {" "}
        {/* Add own links */}
        <h1 className="logo">chatter[box]</h1>
        <br></br>
        <Link color="secondary" to="/">
          Home&nbsp;
        </Link>
        <Link to="/chats">Chats&nbsp;</Link>
        <Link to="" onClick={handleLogOut}>
          Log Out&nbsp;
        </Link>
        <br></br>
        {props.user && <span>Welcome, {props.user?.firstname}!</span>}
      </nav>
    </AppBar>
  );
}
