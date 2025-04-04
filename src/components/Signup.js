  // src/components/Signup.js
  import React, { useState, useEffect } from "react";
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
    CircularProgress,
  } from "@mui/material";
  import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
  } from "@mui/icons-material";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../contexts/AuthContext";
  import AuthLayout from "./AuthLayout";
  import { motion } from "framer-motion";

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
      .test("no-trailing-space", "Name cannot end with a space", (value) => {
        if (!value) return false;
        return value === value.trimEnd();
      }),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required")
      .test("is-valid-domain", "Please use a valid email domain", (value) => {
        if (!value) return false;
        const domain = value.split("@")[1];
        if (!domain) return false;

        const domainParts = domain.split(".");
        if (domainParts.length < 2) return false;

        const topLevelDomain = domainParts[domainParts.length - 1];
        return (
          !domain.startsWith("example.") &&
          !domain.endsWith(".test") &&
          /^[a-zA-Z.-]+$/.test(domain) &&
          topLevelDomain.length >= 2
        );
      }),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const Signup = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

    const { signup } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          navigate("/login");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [success, navigate]);

    const onSubmit = async (data) => {
      try {
        setIsLoading(true);
        setError("");

        const userData = {
          name: data.name.trim(),
          email: data.email.toLowerCase(),
          password: data.password,
        };

        await signup(userData);

        setSuccess(true);
        reset();
      } catch (err) {
        setError(err.message || "An error occurred during signup");
        console.error("Signup error:", err);
      } finally {
        setIsLoading(false);
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formAnimation}
          className="w-full max-w-md mx-auto"
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontStyle: "italic",
              fontWeight: "bold",
              color: "white",
              "@media (max-width: 678px)": {
                fontSize: "15px",
              },
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully! Redirecting...
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              mt: 1,
              width: "100%",
              "& .MuiTextField-root": {
                mb: 2,
                "& label": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                  "& input": { color: "white" },
                  height: "56px", // Default height
                  "@media (max-width: 678px)": {
                    height: "33.6px", // 40% reduction (56 * 0.6 = 33.6)
                    "& input": { fontSize: "0.75rem" }, // Reduced font size
                  },
                },
                "& .MuiFormLabel-root": {
                  "@media (max-width: 678px)": {
                    fontSize: "0.75rem", // Reduced label font size
                  },
                },
                "& .MuiFormHelperText-root": {
                  "@media (max-width: 678px)": {
                    fontSize: "0.65rem", // Reduced helper text font size
                  },
                },
              },
            }}
          >
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoComplete="name"
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^a-zA-Z\s]/g, "");
                    value = value.replace(/^\s+/, "");
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
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
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
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
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ color: "white" }} />
                          ) : (
                            <Visibility sx={{ color: "white" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff sx={{ color: "white" }} />
                          ) : (
                            <Visibility sx={{ color: "white" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                height: 56,
                borderRadius: 2,
                fontSize: "1rem",
                textTransform: "none",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                color: "black",
                "@media (max-width: 678px)": {
                  height: 32,
                  fontSize: "0.875rem", // Adjusted button font size
                },
                "&:hover": {
                  backgroundColor: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography variant="button">Create Account</Typography>
              )}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
                gap: 1,
                mt: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  "@media (max-width: 678px)": {
                    fontSize: "0.75rem", // Reduced font size
                  },
                }}
              >
                Already have an account?
              </Typography>
              <Link
                href="/login"
                variant="body2"
                sx={{
                  zIndex: 1000,
                  color: "white",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                  "@media (max-width: 678px)": {
                    fontSize: "0.75rem", // Reduced font size
                  },
                }}
              >
                Log in here
              </Link>
            </Box>
          </Box>
        </motion.div>
      </AuthLayout>
    );
  };

  export default Signup;