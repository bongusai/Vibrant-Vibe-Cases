import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const storedTimestamp = localStorage.getItem("otpTimestamp");
    if (storedTimestamp && Date.now() - parseInt(storedTimestamp) > 5 * 60 * 1000) {
      localStorage.removeItem("resetOtp");
      localStorage.removeItem("otpTimestamp");
    }
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ open: false, message: "", severity: "success" });
    }, 2000);
  };

  const sendOtp = async () => {
    setErrors({});
    const storedTimestamp = localStorage.getItem("otpTimestamp");
    if (storedTimestamp && Date.now() - parseInt(storedTimestamp) < 5 * 60 * 1000) {
      showSnackbar("Already sent OTP (valid up to 5 min)", "warning");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      localStorage.setItem("resetOtp", response.data.otp);
      localStorage.setItem("otpTimestamp", Date.now().toString());
      showSnackbar("OTP sent successfully!", "success");
    } catch (error) {
      setErrors((prev) => ({ ...prev, email: error.response?.data?.error || "Error sending OTP" }));
    }
  };

  const verifyOtp = () => {
    setErrors({});
    const storedOtp = localStorage.getItem("resetOtp");
    if (!storedOtp || otp !== storedOtp) {
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP" }));
      return;
    }
    localStorage.removeItem("resetOtp");
    localStorage.removeItem("otpTimestamp");
    setOtpVerified(true);
    showSnackbar("OTP verified successfully!", "success");
  };

  const changePassword = async () => {
    setErrors({});
    try {
      await axios.post("http://localhost:5000/api/auth/update-password", { email, newPassword });
      setPasswordChanged(true);
      setEmail(""); // Reset form fields
      setOtp("");
      setNewPassword("");
      setOtpVerified(false); // Reset OTP verification state
      showSnackbar("Password changed successfully!", "success");
    } catch (error) {
      setErrors((prev) => ({ ...prev, newPassword: "Error changing password" }));
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(209, 193, 103, 0.7)",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          marginTop: "50px",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <IconButton onClick={() => window.history.back()} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
        </Box>

        {!passwordChanged ? (
          <>
            <TextField
              fullWidth
              label="Enter Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />
            <Button
              variant="outlined"
              sx={{
                color: "black",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                backgroundColor: "transparent",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)",
                mt: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(0, 0, 0, 0.8)",
                  boxShadow: "0 6px 12px rgba(255, 255, 255, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(1px)",
                },
              }}
              onClick={sendOtp}
            >
              Send OTP
            </Button>

            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              variant="outlined"
              error={!!errors.otp}
              helperText={errors.otp}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#28a745", color: "white", mt: 1, "&:hover": { backgroundColor: "#218838" } }}
              onClick={verifyOtp}
            >
              Verify OTP
            </Button>

            {otpVerified && (
              <>
<TextField
  fullWidth
  label="New Password"
  type={showPassword ? "text" : "password"}
  value={newPassword}
  onChange={(e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Validation logic
    if (!value) {
      setErrors((prev) => ({ ...prev, newPassword: "Password is required" }));
    } else if (value.length < 8) {
      setErrors((prev) => ({ ...prev, newPassword: "Password must be at least 8 characters long" }));
    } else if (!/[A-Z]/.test(value)) {
      setErrors((prev) => ({ ...prev, newPassword: "Password must contain at least one uppercase letter" }));
    } else if (!/[a-z]/.test(value)) {
      setErrors((prev) => ({ ...prev, newPassword: "Password must contain at least one lowercase letter" }));
    } else if (!/\d/.test(value)) {
      setErrors((prev) => ({ ...prev, newPassword: "Password must contain at least one number" }));
    } else if (!/[@$!%*#?&]/.test(value)) {
      setErrors((prev) => ({ ...prev, newPassword: "Password must contain at least one special character (@$!%*#?&)" }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  }}
  onKeyDown={(e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }}
  margin="normal"
  variant="outlined"
  error={!!errors.newPassword}
  helperText={errors.newPassword || "8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#dc3545", color: "white", mt: 1, "&:hover": { backgroundColor: "#c82333" } }}
                  onClick={changePassword}
                  disabled={!newPassword}
                >
                  Change Password
                </Button>
              </>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => (window.location.href = "/login")}>
              Go to Home
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar open={snackbar.open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPassword;