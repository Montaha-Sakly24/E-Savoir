import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import ProfileInfo from "../../Components/Profile/ProfileInfo";
import PasswordSetting from "../../Components/Profile/PasswordSetting";
import { Settings } from "@mui/icons-material";

const Profile = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5", 
        minHeight: "100vh", 
        py: 5, 
        px: 2, 
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={6} 
        sx={{
          p: 4,
          width: "90%",
          maxWidth: "1000px", 
          minHeight: "400px",
          borderRadius: 3, 
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Account Settings
        </Typography>

        
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 2,
            }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Profile Info" sx={{ textTransform: "none" }} />
            <Tab label="Password Setting" sx={{ textTransform: "none" }} />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {tabIndex === 0 && <ProfileInfo />}
            {tabIndex === 1 && <PasswordSetting />}
          </Box>
        

      </Paper>
    </Box>
  );
};

export default Profile;
