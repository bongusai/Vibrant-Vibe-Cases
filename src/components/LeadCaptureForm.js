import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion, AnimatePresence, color } from "framer-motion";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff4081",
    },
    background: {
      default: "#121212",
      paper: "#1f1f1f",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          padding: "0.875rem 1.5rem",
          borderRadius: "8px",
          background: "linear-gradient(45deg,rgb(248, 193, 42),rgb(238, 218, 37))",
          transition: "0.3s ease-in-out",
          boxShadow: "0 0 10px rgba(238, 161, 17, 0.5)",
          "&:hover": {
            transform: "scale(1.08)",
            boxShadow: "0 0 25px rgba(255, 64, 129, 1)",
            color: "black",
            filter: "brightness(1.3)",
          },
          "&:active": {
            transform: "scale(0.95)",
            boxShadow: "0 0 30px rgba(255, 64, 129, 1)",
            filter: "brightness(1.5)",
          },
        },
      },
    },
  },
});

const LeadCaptureForm = () => {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value) => {
    if (!value) return "This field is required";
    return "";
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth={false} disableGutters sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center", background: "#121212", padding: "2rem" }}>
        <Paper elevation={8} sx={{ padding: "2rem", maxWidth: "480px", width: "100%" }}>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "1.5rem", color: "rgb(250, 225, 0)" }}>Get 15% Off Your First Order</Typography>
          <AnimatePresence>
            {submitted ? (
              <Alert severity="success">claimed successfully</Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap="1.5rem">
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Remove non-letters except spaces
                      value = value.replace(/[^a-zA-Z\s]/g, "");
                      // Prevent leading space
                      if (value.length === 0 || value[0] !== " ") {
                        handleChange({ target: { name: "name", value } });
                      }
                    }}
                    onBlur={() => handleBlur("name")}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                 <TextField
                    label="Phone Number"
                    name="phone"
                    inputProps={{ maxLength: 10 }}
                    value={formData.phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
                      handleChange({ target: { name: "phone", value: numericValue } });
                    }}
                    onBlur={() => handleBlur("phone")}
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" disabled={isSubmitting}><Box>{isSubmitting ? <CircularProgress size={24}  /> : <Typography>Claim your 15% Off</Typography>}</Box></Button>
                </Box>
              </form> 
            )}
          </AnimatePresence>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default LeadCaptureForm;