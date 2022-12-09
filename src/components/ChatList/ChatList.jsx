import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../ChatBox/ChatBox";
import Messages from "../Messages/Messages";
import axios from "axios";
import { io } from "socket.io-client";
import Conversation from "../Conversation/Conversation";
import { Input, Grid, TextField, Box, Avatar, Menu } from "@mui/material";
import { Container, Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function ChatList({ user }) {
  const socket = useRef();
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  //get chat
  useEffect(() => {
    const getUserChats = async () => {
      try {
        let payload = await axios.get(`/api/chats/${user._id}`);
        if (!payload.status === 200) throw new Error("No response received");
        setChats(payload.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserChats();
  }, [user._id]);

  //connect to socket.io
  useEffect(() => {
    socket.current = io();
    socket.current.emit("new-user-add", user._id);
  }, [user]);

  //update messages if receiver has sender's chat open
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      if (data.chatId == currentChat?._id) {
        setMessages((messages) => [...messages, data]);
      }
    });
    return () => {
      socket.current.off("receive-message");
    };
  }, [currentChat]);

  //listen on get users, deleted...
  useEffect(() => {
    socket.current.on("deleted", (data) => {
      const { messageId } = data;
      setMessages((messages) =>
        messages.filter((message) => message._id !== messageId)
      );
    });
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.current.off("deleted");
      socket.current.off("get-users");
      socket.current.disconnect();
    };
  }, []);

  // get messages for chat
  useEffect(() => {
    const serverRoute = "api/messages";
    const getChatMessages = async () => {
      try {
        let { data } = await axios.get(`${serverRoute}/${currentChat._id}`);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChat !== null) {
      getChatMessages();
    }
  }, [currentChat]);

  //set all users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        let { data } = await axios.get(`api/users`);
        data = data.filter((users) => users._id != user._id);
        setAllUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, []);

  //start chat
  async function startChat(friendId) {
    try {
      const newChat = await axios.post(
        `api/chats/create/${user._id}/${friendId}`
      );
      setChats((chats) => [...chats, newChat.data]);
    } catch (error) {
      console.log(error);
    }
  }

  //check who is online
  function isOnline(chat) {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  }

  // set currentChat
  function setChat(chat) {
    setCurrentChat(chat);
    updateMessageStatus(chat);
  }
  // create function that calls back to setCurrentChat, pass it into Conversations
  function updateReadMessages(cb) {
    // updateMessageStatus(chatId)
  }
  // separate setCurrentChat
  // update message readstatus to true
  // currently, if a new msg is sent, then unread msgs will show after refresh
  // second, even if sender sends msg, after refresh, unread msgs will show in
  // their chatbox with the receiver
  // third, if sender clicks back into convo with receiver, then that will
  // clear the receiver's unread messages
  const updateMessageStatus = async (chat) => {
    try {
      await axios.put(`api/messages/status/${chat._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <p className="section-heading">Find a Friend to Start Conversation</p>
          <FormControl
            fullWidth
            sx={{ border: "3px solid blue", borderRadius: "50px" }}
          >
            <InputLabel sx={{ border: "none" }}>Find Friends</InputLabel>
            <Select>
              <MenuItem value={""}>
                {/* <TextField
                  sx={{
                    width: "25vw",
                    border: "3px solid #2f15d1",
                    margin: "10px",
                  }}
                  className="outlined-basic"
                  type="text"
                  placeholder="Search for a User"
                ></TextField> */}
              </MenuItem>
              {allUsers.map((friend, idx) => (
                <MenuItem key={idx} onClick={() => startChat(friend._id)}>
                  {friend?.firstname} {friend?.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <p>Click a Chat to Start Conversation</p>
          <Box>
            <div>
              <p className="section-heading">Active Chats:</p>
              {chats.map((chat, idx) => (
                <div
                  style={{
                    margin: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  key={idx}
                  onClick={() => setChat(chat)}
                >
                  <Conversation
                    currentUserId={user._id}
                    chat={chat}
                    online={isOnline(chat)}
                    user={user}
                  />
                </div>
              ))}
            </div>
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            // justifyContent: "center",
            height: "50px",
          }}
        >
          {/* <Container className="messages-container"> */}
          <ChatBox
            currentChat={currentChat}
            currentUserId={user._id}
            setMessages={setMessages}
            setNewMessage={setNewMessage}
            messages={messages}
            newMessage={newMessage}
            socket={socket}
            user={user}
          />
          {/* </Container> */}
        </Grid>
      </Grid>
    </>
  );
}
