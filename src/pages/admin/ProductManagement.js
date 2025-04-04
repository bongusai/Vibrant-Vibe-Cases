import {
  Add as AddIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Select,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";

const API_BASE_URL = "https://vibrant-vibe-cases.onrender.com/api";

const validateField = (name, value, formData, imageFile) => {
  switch (name) {
    case "name":
      return !value.trim() ? "Product name is required" : "";
    case "model":
      return !value.trim() ? "Brand & model is required" : "";
    case "description":
      return !value.trim() ? "Description is required" : "";
    case "category":
      return !value ? "Category is required" : "";
    case "price":
      if (!value) return "Price is required";
      const priceNum = Number(value);
      if (isNaN(priceNum)) return "Price must be a valid number";
      if (priceNum < 2) return "Price must be at least ₹2";
      if (priceNum > 10000) return "Price cannot exceed ₹10,000";
      if (formData.discountPrice && Number(formData.discountPrice) >= priceNum) {
        return "Price must be greater than discount price";
      }
      return "";
    case "discountPrice":
      if (value) {
        const discountNum = Number(value);
        if (isNaN(discountNum)) return "Discount price must be a valid number";
        if (discountNum < 1) return "Discount price must be at least ₹1";
        if (discountNum > 10000) return "Discount price cannot exceed ₹10,000";
        if (formData.price && discountNum >= Number(formData.price)) {
          return "Discount price must be less than regular price";
        }
      }
      return "";
    case "image":
      return !imageFile ? "Product image is required" : "";
    default:
      return "";
  }
};

const ProductManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState({});
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    image: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    inStock: true,
    rating: 4.5,
    reviews: 0,
  });

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "image") {
      const file = e.target.files[0];
      if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          showErrorAlert("Please upload a valid image (JPEG, PNG, JPG)");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showErrorAlert("Image size must be less than 5MB");
          return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      const error = validateField(name, value, formData, imageFile);
      setErrors((prev) => ({ ...prev, [name]: error }));

      if (error && value && name !== "price" && name !== "discountPrice") {
        showErrorAlert(error);
      }

      if (name === "price" || name === "discountPrice") {
        const newPriceData = {
          price: name === "price" ? value : formData.price,
          discountPrice: name === "discountPrice" ? value : formData.discountPrice,
        };
        const newSavings = calculateSavings(newPriceData.price, newPriceData.discountPrice);
        setSavings(newSavings);
      }
    }
  };

  const handleStockToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      inStock: e.target.checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      image: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      inStock: true,
      rating: 4.5,
      reviews: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setSavings(null);
  };

  const calculateSavings = (price, discountPrice) => {
    if (price && discountPrice) {
      const priceNum = Number(price);
      const discountNum = Number(discountPrice);
      if (priceNum > discountNum && priceNum > 0) {
        const savings = ((priceNum - discountNum) / priceNum) * 100;
        return savings.toFixed(1);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key], formData, imageFile);
    });
    newErrors.image = validateField("image", "", formData, imageFile);
    setErrors(newErrors);

    const errorMessages = Object.values(newErrors).filter((error) => error);
    if (errorMessages.length > 0) {
      showErrorAlert(errorMessages[0]);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/add-products`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          background: theme.palette.background.paper,
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: theme.palette.primary.main,
            }}
          >
            Product Management
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand & Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.model}
                helperText={errors.model}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
                inputProps={{ min: 2, max: 10000, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount Price"
                name="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={handleInputChange}
                error={!!errors.discountPrice}
                helperText={errors.discountPrice}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                size={isMobile ? "small" : "medium"}
                inputProps={{ min: 1, max: 10000, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12}>

            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.category}
              >
                <InputLabel
                  sx={{
                    color: "#000",
                    backgroundColor: formData.category ? "#fff" : "transparent",
                    padding: "0 4px",
                    "&.Mui-focused": {
                      color: "#6C63FF",
                      backgroundColor: "#fff",
                    },
                  }}
                >
                  Category
                </InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #ccc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "1px solid #999" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "2px solid #6C63FF" },
                    backgroundColor: "#fff",
                  }}
                >
                  <MenuItem value="Mobile">📱 Mobile</MenuItem>
                  <MenuItem value="Tablet">📟 Tablet</MenuItem>
                  <MenuItem value="Laptop" disabled sx={{ textDecoration: "line-through", color: "gray" }}>
                    💻 Laptop (Out of Stock)
                  </MenuItem>
                  <MenuItem value="Smartwatch" disabled sx={{ textDecoration: "line-through", color: "gray" }}>
                    ⌚ Smartwatch (Coming Soon)
                  </MenuItem>
                </Select>
                {errors.category && (
                  <Typography color="error" variant="caption">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<ImageIcon />}
                sx={{ height: isMobile ? "40px" : "56px" }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleInputChange}
                  name="image"
                  required
                />
              </Button>
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    mt: 2,
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.image || "Image is required"}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                size={isMobile ? "small" : "medium"}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.inStock}
                    onChange={handleStockToggle}
                    color="primary"
                  />
                }
                label="In Stock"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: "120px" } }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: "120px" } }}
                  startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductManagement;