import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";

function AdminProfile() {
  const { user } = useAuth();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md")); // Tablets
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 3,
          maxWidth: "500px",
          mx: "auto",
          borderRadius: 3,
          textAlign: isMobile ? "center" : "left",
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Profile Header */}
        <Box
          display="flex"
          alignItems="center"
          flexDirection={isMobile ? "column" : "row"}
          mb={3}
        >
          {/* Animated Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              sx={{
                width: isMobile ? 80 : isTablet ? 90 : 100,
                height: isMobile ? 80 : isTablet ? 90 : 100,
                mr: isMobile ? 0 : 3,
                mb: isMobile ? 2 : 0,
                bgcolor: "#6C63FF",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "A"}
            </Avatar>
          </motion.div>

          {/* User Details */}
          <Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: "bold",
                color: "#343a40",
                textTransform: "capitalize",
              }}
            >
              {user?.name || "Admin"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.email || "admin@example.com"}
            </Typography>
          </Box>
        </Box>

        {/* Role Information */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: "#495057",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Role: Admin
          </Typography>
        </motion.div>
      </Paper>
    </motion.div>
  );
}

export default AdminProfile;
