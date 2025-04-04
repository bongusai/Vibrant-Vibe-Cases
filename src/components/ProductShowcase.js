import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Static exchange rate (INR to CNY) - Replace with API call in production
const EXCHANGE_RATE_INR_TO_CNY = 0.083;

function ProductShowcase({ category }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");

  useEffect(() => {
    fetchProducts();
    // Listen for language changes in localStorage
    const handleStorageChange = () => {
      setSelectedLanguage(localStorage.getItem("selectedLanguage") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();
    try {
      setLoadingProducts((prev) => ({ ...prev, [product._id]: true }));
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        toast.error("User not logged in!");
        return;
      }

      const userResponse = await axios.get(`${API_BASE_URL}/users/getUserId/${userEmail}`);
      const userId = userResponse.data.userId;
      if (!userId) {
        toast.error("User ID not found!");
        return;
      }

      await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
      });

      toast.success(`${product.name} added to cart!`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const getGridSize = () => {
    if (isMobile) return 6;
    if (isTablet) return 4;
    return 3;
  };

  // Function to get currency symbol and converted price
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      id="productshowcase"
      sx={{
        py: 4,
        px: 2,
        maxWidth: "1200px",
        margin: "0 auto",
        bgcolor: "background.default",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <ToastContainer />
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 4, fontWeight: "bold" }}
      >
        {category} Products
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {products.map((product, index) => {
          const { symbol, finalPrice, originalPrice, discount } = getPriceDetails(product.price, product.discountPrice);

          return (
            <Grid item xs={6} sm={4} md={getGridSize()} key={product._id}>
              {/* <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              > */}
                <Card
                  onClick={() => handleCardClick(product._id)}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 4,
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      backgroundColor: "white",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                    image={`http://localhost:5000${product.image}`}
                    alt={product.name}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 2,
                      boxShadow: "inset 0px 0px 10px rgba(255, 255, 255, 0.8)",
                      borderRadius: "0px 0px 0px 12px",
                      bgcolor: "rgba(59, 59, 59, 0.8)",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        color: "text.primary",
                        fontWeight: "bold",
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        "@media (max-width: 768px)": {
                          height: "6vh",
                          fontSize: "0.8rem",
                          lineHeight: "1.2",
                          display: "-webkit-box",
                          "-webkit-box-orient": "vertical",
                          "-webkit-line-clamp": "2",
                          overflow: "hidden",
                        },
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          color: "#888",
                          background: "linear-gradient(45deg,rgb(255, 255, 255),rgb(255, 255, 255))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          padding: "0.2em 0.4em",
                          borderRadius: "4px",
                        }}
                      >
                        {product.model}
                      </span>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: { sm: "space-between" },
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="rgb(0, 255, 34)"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                      >
                        {symbol}{finalPrice}
                      </Typography>
                      {product.discountPrice > 0 && (
                        <>
                          <Typography
                            variant="body2"
                            color="error"
                            sx={{
                              fontWeight: "bold",
                              textDecoration: "line-through",
                              mx: { xs: 0, sm: 1 },
                              mt: { xs: 0.5, sm: 0 },
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            {symbol}{originalPrice}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0,
                              color: "text.secondary",
                              fontSize: {
                                xs: "0.7rem",
                                sm: "0.8rem",
                                lg: "0.7rem",
                              },
                            }}
                          >
                            Save {symbol}{discount}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.inStock || loadingProducts[product._id]}
                      sx={{
                        mt: 2,
                        bgcolor: "rgba(255, 136, 0, 0.7)",
                        color: "black",
                        fontSize: { xs: "0.5rem", sm: "1rem" },
                        py: { xs: 1, sm: 1.5 },
                        width: { xs: "100%", sm: "auto" },
                        boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        transition: "0.3s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(255, 238, 0, 0.7)",
                          color: "white",
                          boxShadow: "0 0 20px rgba(255, 230, 0, 0.8), 0 0 40px rgba(255, 251, 0, 0.6)",
                        },
                      }}
                    >
                      <Box>
                        {loadingProducts[product._id] ? (
                          <>
                            <CircularProgress
                              size={24}
                              sx={{
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-12px",
                                color: "white",
                              }}
                            />
                            <span style={{ opacity: 0 }}>Add to Cart</span>
                          </>
                        ) : (
                          <Typography
                          component="span"
                          sx={{
                            fontSize: { xs: '10px', sm: '14px' }
                          }}
                        >
                          Add to Cart
                        </Typography>
                        )}
                      </Box>
                    </Button>
                  </CardContent>
                </Card> 
              {/* </motion.div> */}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ProductShowcase;