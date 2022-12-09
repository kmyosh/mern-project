import { useState } from "react";
import UpdateUserModal from "../../components/UpdateUserModal/UpdateUserModal";
import { Button, IconButton, Link, Grid } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Stack from "@mui/material/Stack";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import NavBar from "../../components/NavBar/NavBar";

export default function ProfilePage({ user, setUser }) {
  const [modalOpened, setModalOpened] = useState(false);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xl={1}></Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <div>
            <NavBar user={user} setUser={setUser} />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          sx={{
            // justifyContent: "center",
            // alignContent: "center",
            // alignItems: "center",
            margin: "auto",
            marginTop: "10vh",
            // height: "50px",
          }}
        >
          <Button
            sx={{
              // padding: "20px",
              justifyContent: "right",
              alignContent: "right",
            }}
          >
            <Link>
              <SettingsOutlinedIcon
                color="primary"
                onClick={() => setModalOpened(true)}
              ></SettingsOutlinedIcon>
            </Link>
            <div>Edit Profile</div>
          </Button>
          <div
            style={{
              margin: "auto",
              alignContent: "center",
            }}
          >
            <ProfileCard user={user} />
          </div>
          <UpdateUserModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
            user={user}
            setUser={setUser}
          />
        </Grid>
        <Grid item xl={1}></Grid>
      </Grid>
    </>
  );
}
