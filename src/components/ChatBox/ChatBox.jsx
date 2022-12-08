import React, { useEffect, useState } from "react";
import Messages from "../Messages/Messages";
import InputEmoji from "react-input-emoji";
import "./ChatBox.css";
import axios from "axios";
import { Box, Button, IconButton, Container } from "@mui/material";
import { Stack } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import ChatMemberModal from "../ChatMemberModal/ChatMemberModal";

export default function ChatBox({
  currentChat,
  currentUserId,
  setMessages,
  setNewMessage,
  messages,
  newMessage,
  socket,
  user,
}) {
  const [userData, setUserData] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const receiverId = currentChat?.members?.find((id) => id !== currentUserId);
  // get receiver data
  useEffect(() => {
    console.log("receiveId", receiverId);
    setUserData(receiverId);
  }, [currentChat, currentUserId]);

  //handle functions
  function handleChange(inputText) {
    setNewMessage(inputText);
  }
  async function handleSend(e) {
    e.preventDefault();
    const messageInfo = {
      chatId: currentChat._id,
      senderId: currentUserId,
      text: newMessage,
    };

    try {
      let newMessage = await axios.post(`api/messages`, messageInfo);
      socket.current.emit("send-message", {
        messageInfo: newMessage.data,
        receiverId,
      });
      setMessages([...messages, newMessage.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {/* chatmembermodal here */}
      {currentChat ? (
        <div>
          <hr />
          <div
            style={{
              border: "1px solid black",
              display: "flex",
              flexDirection: "row",
            }}
            onClick={() => {
              setModalOpened(true);
            }}
          >
            <div style={{ border: "1px solid black" }}>Profile Pic</div>
            Friend: {userData}
          </div>
          <ChatMemberModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
          />
          <div className="messages-container">
            <Messages
              messages={messages}
              setMessages={setMessages}
              socket={socket}
              currentChat={currentChat}
              currentUserId={currentUserId}
              user={user}
              receiverId={userData}
            />
          </div>

          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            justifyContent="center"
            sx={{ width: "50vw", justifyItems: "center", margin: "auto" }}
          >
            <form onSubmit={handleSend}>
              <InputEmoji
                color="secondary"
                value={newMessage}
                onChange={handleChange}
              />

              <button type="submit">
                <IconButton>SEND </IconButton>
              </button>
              <SendIcon color="secondary">Send</SendIcon>
            </form>
          </Stack>
        </div>
      ) : (
        <span>Click a Chat to Start Conversation</span>
      )}
    </>
  );
}
