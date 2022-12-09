import React, { useEffect, useState } from "react";
import { Input, Grid, TextField } from "@mui/material";
import "./Conversation.css";
import axios from "axios";
import { Avatar, Badge } from "@mui/material";
import Stack from "@mui/material/Stack";
// testing
import { styled } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   "& .MuiBadge-badge": {
//     right: -3,
//     top: 13,
//     border: `2px solid ${theme.palette.background.paper}`,
//     padding: "0 4px",
//   },
// }));
// testing

export default function Conversation({ currentUserId, chat, online, user }) {
  const [userData, setUserData] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(null);

  //find all users but the current user
  useEffect(() => {
    const friendId = chat.members.find((id) => id !== currentUserId);
    async function getUserData() {
      try {
        const { data } = await axios.get(`api/users/${friendId}`);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, []);

  //still working on this
  useEffect(() => {
    const countUnreadMessages = async () => {
      try {
        let count = 0;
        let { data } = await axios.get(`api/messages/${chat._id}`);
        data.forEach((message) => {
          if (message.readStatus === null) {
            count++;
          }
        });
        setUnreadMessages(count);
      } catch (error) {
        console.log(error);
      }
    };
    countUnreadMessages();
  }, [unreadMessages]);

  return (
    <Grid
      container
      spacing={3}
      sx={{
        paddingLeft: "5px",
        alignItems: "center",
        // overflow: "scroll",
        textAlign: "left",
      }}
    >
      <Grid item xs={4}>
        {online ? (
          <img
            className="profileImg"
            src={
              userData?.profilePicture === ""
                ? "./logo192.png"
                : userData?.profilePicture
            }
            style={{ border: "4px solid green" }}
          />
        ) : (
          <img
            className="profileImg"
            src={
              userData?.profilePicture === ""
                ? "./logo192.png"
                : userData?.profilePicture
            }
          />
        )}
      </Grid>
      <Grid item xs={4}>
        <span className="name">
          {userData?.firstname}&nbsp;{userData?.lastname}
        </span>
        {/* message preview goes here */}
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          justifyContent: "right",
        }}
      >
        {/* notification goes here */}

        {unreadMessages === 0 ? (
          <div></div>
        ) : (
          <Badge
            className="badge"
            color="secondary"
            badgeContent={unreadMessages}
          >
            <MailOutlineIcon color="primary"></MailOutlineIcon>
          </Badge>
        )}
      </Grid>
    </Grid>
  );
}
