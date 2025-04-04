import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import MultiStepCheckoutForm from "./MultiStepCheckoutForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://vibrant-vibe-cases.onrender.com/api";

const EXCHANGE_RATE_INR_TO_CNY = 0.083;

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery("(min-width:2000px)");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [processingBuyNow, setProcessingBuyNow] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");

  useEffect(() => {
    fetchProductDetails();
    // Listen for language changes in localStorage
    const handleStorageChange = () => {
      setSelectedLanguage(localStorage.getItem("selectedLanguage") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/detail/${productId}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch product details. Please try again later.");
      toast.error("Error loading product details");
    } finally {
      setLoading(false);
    }
  };

  const getUserId = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      throw new Error("User not logged in");
    }
    const userResponse = await axios.get(`${API_BASE_URL}/users/getUserId/${userEmail}`);
    return userResponse.data.userId;
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);
      const userId = await getUserId();
      await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
      });
    } catch (error) {
      if (error.message === "User not logged in") {
        toast.error("Please log in to add items to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setProcessingBuyNow(true);
      const userId = await getUserId();
      await axios.delete(`${API_BASE_URL}/cart/${userId}`);
      await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
      });
      setOpenCheckout(true);
    } catch (error) {
      if (error.message === "User not logged in") {
        toast.error("Please log in to proceed with purchase");
      } else {
        toast.error("Failed to process purchase");
      }
    } finally {
      setProcessingBuyNow(false);
    }
  };

  const getPriceDetails = (price, discountPrice) => {
    const isChinese = selectedLanguage === "zh-TW";
    const currencySymbol = isChinese ? "¥" : "₹";
    const conversionRate = isChinese ? EXCHANGE_RATE_INR_TO_CNY : 1;

    const convertedPrice = (price * conversionRate).toFixed(2);
    const convertedDiscountPrice = (discountPrice * conversionRate).toFixed(2);
    const finalPrice = (price - discountPrice) * conversionRate;

    return {
      symbol: currencySymbol,
      finalPrice: finalPrice.toFixed(2),
      originalPrice: convertedPrice,
      discount: convertedDiscountPrice,
    };
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Alert severity="error" sx={{ width: "100%", maxWidth: "sm" }}>
            {error || "Product not found."}
          </Alert>
        </Container>
      </>
    );
  }

  const { symbol, finalPrice, originalPrice } = getPriceDetails(product.price, product.discountPrice || 0);

  return (
    <>
      <Header />
      <Container
        maxWidth={false}
        sx={{
          maxWidth: isLargeScreen ? "1800px" : "lg",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          bgcolor: "rgb(81,81,81)"
        }}
        style={{
          minHeight: "100vh",
          alignContent: "center",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", mb: 2 }} className="mt-5">
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
          </Box>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
          >
            {/* Left Column - Image */}
            <Grid item xs={12} md={6} lg={5}>
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  position: "relative",
                }}
              >
                <Box
                  component={motion.img}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={`https://vibrant-vibe-cases.onrender.com${product.image}`}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    maxHeight: { xs: 300, sm: 400, md: 500 },
                  }}
                />
              </Paper>
            </Grid>

            {/* Right Column - Product Details */}
            <Grid item xs={12} md={6} lg={5}>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.75rem", sm: "1.75rem", md: "1.75rem" },
                    background:
                      "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {product.model}
                </Typography>

                <Box
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Rating
                    value={product.rating || 4.5}
                    readOnly
                    precision={0.5}
                  />
                  <Typography variant="body2" color="orange">
                    ({product.reviews || 0} reviews)
                  </Typography>
                </Box>

                <Chip
                  label={product.inStock ? "In Stock" : "Out of Stock"}
                  color={product.inStock ? "success" : "error"}
                  size="small"
                  sx={{ mb: 3 }}
                />

                <Typography
                  variant="h4"
                  color="white"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  }}
                >
                  {symbol}{finalPrice}
                </Typography>

                {product.discountPrice > 0 && (
                  <Typography
                    variant="body1"
                    color="error"
                    sx={{ mb: 1, textDecoration: "line-through" }}
                  >
                    {symbol}{originalPrice}
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="body1"
                  color="white"
                  sx={{ mb: 4, lineHeight: 1.8 }}
                >
                  {product.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="white"
                    size="large"
                    startIcon={<ShoppingCart sx={{ color: "white" }} />}
                    sx={{
                      flex: 2,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: "0 4px 6px rgba(187, 134, 252, 0.25), inset 0 2px 4px rgba(187, 134, 252, 0.25)",
                      position: "relative",
                      color: "white",
                    }}
                    onClick={addToCart}
                    disabled={!product.inStock || addingToCart}
                  >
                    <Box>
                      {addingToCart ? (
                        <>
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              left: "50%",
                              marginLeft: "-12px",
                            }}
                          />
                          <span style={{ opacity: 0, color: "white" }}>Add to Cart</span>
                        </>
                      ) : (
                        <Typography component="span">Add to Cart</Typography>
                      )}
                    </Box>
                  </Button>
                  {/* Uncomment if you want to re-enable Buy Now */}
                  {/* <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                      position: "relative",
                    }}
                    onClick={handleBuyNow}
                    disabled={!product.inStock || processingBuyNow}
                  >
                    <Box>
                      {processingBuyNow ? (
                        <>
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              left: "50%",
                              marginLeft: "-12px",
                            }}
                          />
                          <span style={{ opacity: 0 }}>Buy Now</span>
                        </>
                      ) : (
                        <Typography component="span">Buy Now</Typography>
                      )}
                    </Box>
                  </Button> */}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Checkout Dialog */}
        <Dialog
          open={openCheckout}
          onClose={() => setOpenCheckout(false)}
          maxWidth="md"
          fullWidth
        >
          <MultiStepCheckoutForm
            product={{
              name: product.name,
              price: product.price - (product.discountPrice || 0),
              shipping: 9.99,
            }}
            onClose={() => setOpenCheckout(false)}
          />
        </Dialog>
      </Container>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </>
  );
}

export default ProductDetail;