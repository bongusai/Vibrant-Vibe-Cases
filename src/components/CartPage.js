import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Paper,
  Container,
  IconButton,
  Dialog,
} from "@mui/material";
import { DeleteOutline, ShoppingCart, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MultiStepCheckoutForm from "./MultiStepCheckoutForm.js";
import Header from "./Header.js";
import axios from "axios";
import { toast } from "react-toastify";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://vibrant-vibe-cases.onrender.com/api";
const EXCHANGE_RATE_INR_TO_CNY = 0.083;

function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [userId, setUserId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");

  // Fetch user ID with cleanup
  const fetchUserId = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/getUserId/${userEmail}`);
      setUserId(response.data.userId);
    } catch (err) {
      toast.error("Failed to fetch user ID.");
      console.error("Error fetching user ID:", err);
    }
  }, [userEmail]);

  // Fetch cart with cleanup
  const fetchCart = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      const cartData = response.data || { items: [] };
      const validatedItems = cartData.items
        .filter((item) => item?.productId && typeof item.productId === "object" && item.productId._id)
        .map((item) => ({
          ...item,
          quantity: Math.max(1, item.quantity || 1),
        }));
      setCart({ ...cartData, items: validatedItems });
      setError(null);
    } catch (err) {
      setError("Failed to load cart.");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userEmail) {
      toast.error("User not logged in!");
      navigate("/login");
      return;
    }
    fetchUserId();
    // Listen for language changes in localStorage
    const handleStorageChange = () => {
      setSelectedLanguage(localStorage.getItem("selectedLanguage") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userEmail, navigate, fetchUserId]);

  useEffect(() => {
    let mounted = true;
    if (userId && mounted) {
      fetchCart();
    }
    return () => {
      mounted = false;
    };
  }, [userId, fetchCart]);

  const removeFromCart = async (productId) => {
    if (!productId || !userId) return;
    try {
      await axios.delete(`${API_BASE_URL}/cart/${userId}/item/${productId}`);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.productId._id !== productId),
      }));
      toast.success("Item removed from cart!");
    } catch (err) {
      toast.error("Failed to remove item.");
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productId, change) => {
    if (!productId || !userId) return;
    const item = cart.items.find((item) => item.productId._id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    try {
      await axios.patch(`${API_BASE_URL}/cart/${userId}/item/${productId}`, {
        quantity: newQuantity,
      });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.productId._id === productId ? { ...item, quantity: newQuantity } : item
        ),
      }));
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update quantity.");
      console.error("Error updating quantity:", err);
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

  const getTotalPrice = () => {
    return cart.items
      .reduce((total, item) => {
        if (!item?.productId?.price || !item?.productId?.discountPrice) return total;
        const { finalPrice } = getPriceDetails(item.productId.price, item.productId.discountPrice);
        return total + parseFloat(finalPrice) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleProceedToBuy = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ marginTop: 15 }}>
        {loading ? (
          <Box sx={{ mt: 10, textAlign: "center" }}>
            <Typography>Loading cart...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ mt: 10, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 10,
              bgcolor: "rgba(136, 136, 136, 0.6)",
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 255, 255, 0.2)",
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
              Your Cart
            </Typography>
            {cart.items.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
                Your cart is empty
              </Typography>
            ) : (
              <Box>
                <List>
                  {cart.items.map((item) => {
                    if (!item?.productId?._id) return null;
                    const key = item.productId._id;
                    const { symbol, finalPrice, originalPrice } = getPriceDetails(
                      item.productId.price,
                      item.productId.discountPrice
                    );
                    return (
                      <React.Fragment key={key}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt={item.productId.model || "Product"}
                              src={`https://vibrant-vibe-cases.onrender.com${item.productId.image}`}
                              variant="square"
                              sx={{ width: 80, height: 80, mr: 2 }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.productId.model || "Unknown Product"}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {symbol}{finalPrice}
                                </Typography>
                                {item.productId.discountPrice > 0 && (
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textDecoration: "line-through", ml: 1 }}
                                  >
                                    {symbol}{originalPrice}
                                  </Typography>
                                )}
                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                  <IconButton
                                    onClick={() => updateQuantity(item.productId._id, -1)}
                                    disabled={item.quantity <= 1}
                                    sx={{ border: "2px solid green", color: "green" }}
                                  >
                                    <Remove />
                                  </IconButton>
                                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                  <IconButton
                                    onClick={() => updateQuantity(item.productId._id, 1)}
                                    sx={{ border: "2px solid green", color: "green" }}
                                  >
                                    <Add />
                                  </IconButton>
                                </Box>
                              </>
                            }
                          />
                          <Button
                            onClick={() => removeFromCart(item.productId._id)}
                            sx={{
                              color: "red",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              "&:hover": {
                                color: "white",
                                backgroundColor: "rgba(255, 0, 0, 0.7)",
                                boxShadow: "0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6)",
                                borderColor: "white",
                              },
                              "@media (max-width: 768px)": {
                                "& span": { display: "none" },
                                padding: "0px",
                              },
                              "@media (min-width: 769px)": {
                                "& span": { display: "inline" },
                              },
                            }}
                          >
                            <DeleteOutline />
                          </Button>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    );
                  })}
                </List>
                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Total: {cart.items.length > 0 ? getPriceDetails(cart.items[0].productId.price, cart.items[0].productId.discountPrice).symbol : "₹"}{getTotalPrice()}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={handleProceedToBuy}
                    size="large"
                    sx={{
                      border: "2px solid black",
                      color: "black",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      background: "rgba(34, 47, 226, 0.1)",
                      boxShadow: "0 0 10px rgba(48, 238, 23, 0.5)",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "rgba(60, 233, 8, 0.7)",
                        boxShadow: "0 0 20px rgba(50, 231, 14, 0.8), 0 0 40px rgba(96, 238, 14, 0.6)",
                        borderColor: "white",
                      },
                    }}
                  >
                    Proceed to Buy
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        )}
        <Dialog
          open={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <MultiStepCheckoutForm
            totalPrice={getTotalPrice()}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </Dialog>
      </Container>
    </>
  );
}

export default CartPage;