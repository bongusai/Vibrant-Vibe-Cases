// src/components/Login.js
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { login, resetInactivityTimeout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setGlobalError] = useState("");

  // If user is already logged in, redirect to home

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setGlobalError("");

      const user = await login(data.email, data.password);

      // Reset inactivity timeout after successful login
      resetInactivityTimeout();

      // Check user role and navigate accordingly
      if (user.role === "admin") {
        // navigate("/admin");
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (err) {
      setGlobalError(err.message || "Login failed. Please try again.");

      // Set field-specific errors if they exist
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach((key) => {
          setError(key, {
            type: "manual",
            message: err.response.data.errors[key],
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <AuthLayout>
      <motion.div initial="hidden" animate="visible" variants={formAnimation}>
        <Typography component="h1" variant="h4" gutterBottom align="center" style={{fontStyle:"italic", fontWeight:"bold"}}>
          Log In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

<Box
  component="form"
  onSubmit={handleSubmit(onSubmit)}
  noValidate
  sx={{
    mt: 1,
    width: "100%",
    maxWidth: "400px",
    mx: "auto",
    color: "white",
  }}
>
  <Controller
    name="email"
    control={control}
    defaultValue=""
    render={({ field }) => (
      <TextField
        {...field}
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isSubmitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: "white" }} />
            </InputAdornment>
          ),
          sx: { color: "white" } // User input text color
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" }, 
            "&:hover fieldset": { borderColor: "white" }, 
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
          "& .MuiInputLabel-root": {
            color: "white", 
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "white", 
          },
          "& .MuiFormHelperText-root": {
            color: "white", 
          },
          "& input": { color: "white" } // User input text color
        }}
      />
    )}
  />

  <Controller
    name="password"
    control={control}
    defaultValue=""
    render={({ field }) => (
      <TextField
        {...field}
        margin="normal"
        required
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isSubmitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: "white" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ color: "white" }} />
                ) : (
                  <Visibility sx={{ color: "white" }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
          sx: { color: "white" } // User input text color
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" }, 
            "&:hover fieldset": { borderColor: "white" }, 
            "&.Mui-focused fieldset": { borderColor: "white" }, 
          },
          "& .MuiInputLabel-root": {
            color: "white", 
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "white", 
          },
          "& .MuiFormHelperText-root": {
            color: "white", 
          },
          "& input": { color: "white" } // User input text color
        }}
      />
    )}
  />

<Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 3,
    mb: 2,
    height: 56,
    borderRadius: 2,
    fontSize: "1rem",
    textTransform: "none",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
    backdropFilter: "blur(10px)", // Blur effect for glass look
    WebkitBackdropFilter: "blur(10px)", // Safari support
    border: "1px solid rgba(255, 255, 255, 0.3)", // Border for depth
    color: "#fff", // Text color
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2), 0 6px 20px rgba(0, 0, 0, 0.15)", // Soft glowing effect
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(255, 255, 255, 0.3), 0 10px 25px rgba(0, 0, 0, 0.2)",
      background: "rgba(255, 255, 255, 0.2)", // Slightly more visible on hover
    },
    "&:active": {
      transform: "translateY(1px)",
      boxShadow: "0 2px 6px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    "&:disabled": {
      background: "rgba(255, 255, 255, 0.05)",
      color: "rgba(255, 255, 255, 0.5)",
      boxShadow: "none",
      cursor: "not-allowed",
    },
  }}
  disabled={isSubmitting}
>
  {isSubmitting ? "Logging in..." : "Log In"}
</Button>


  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      flexDirection: isMobile ? "column" : "row",
      // alignItems: "center",
      mt: 2,
    }}
  >
    <Link
      href="/forgot-password"
      variant="body2"
      sx={{ mb: isMobile ? 1 : 0, color: "white" }}
      onClick={(e) => {
        e.preventDefault();
        navigate("/forgotpassword");
      }}
    >
      Forgot password?
    </Link>
    
    <Link
      href="/signup"
      variant="body2" 
      sx={{ color: "white" , cursor: "pointer", alignContent: "center" }}
      onClick={(e) => {
        e.preventDefault();
        navigate("/signup");
      }}
    >
      Don't have an account? Sign Up
    </Link>
  </Box>
</Box>


      </motion.div>
    </AuthLayout>
  );
};

export default Login;
