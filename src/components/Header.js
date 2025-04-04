import React, { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  useMediaQuery
} from "@mui/material";
import { motion } from "framer-motion";
import { X as CloseIcon, MenuIcon, ShoppingBag, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Header(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const fetchCartCount = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.get(
        `https://vibrant-vibe-cases.onrender.com/api/cart/${currentUser.id}`
      );
      const cartItems = response.data.items || [];
      const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(itemCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (reload) {
      window.location.reload();
      setReload(false);
    }
  }, [reload]);

  const handleReloadClick = () => {
    setReload(true);
  };

  useEffect(() => {
    const scriptId = "google-translate-script";
  
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
  
    window.googleTranslateElementInit = () => {
      const element = document.getElementById("google_translate_element");
      if (element && element.innerHTML.trim() === "") {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,zh-TW,zh-HK",
            autoDisplay: false,
          },
          "google_translate_element"
        );
  
        // Set the language to saved one if it's not English
        if (savedLanguage !== 'en') {
          setTimeout(() => {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
              selectElement.value = savedLanguage;
              selectElement.dispatchEvent(new Event('change'));
            }
          }, 1000);
        }
      }
    };
  
    const handleLanguageChange = () => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.addEventListener('change', (e) => {
          const selectedLanguage = e.target.value;
          const previousLanguage = localStorage.getItem('selectedLanguage');
          
          if (selectedLanguage !== previousLanguage) {
            localStorage.setItem('selectedLanguage', selectedLanguage);
            window.location.reload(); // Refresh on language change
          }
        });
      }
    };
  
    // Check for the select element and attach event listener
    const checkForSelectElement = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        handleLanguageChange();
        clearInterval(checkForSelectElement);
      }
    }, 500);
  
    return () => {
      clearInterval(checkForSelectElement);
    };
  }, []);
  

  const handleLogout = () => {
    logout();
    document.cookie = "googtrans=/en/en; path=/";
    localStorage.removeItem("selectedLanguage");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <motion.div>
        <AppBar sx={{ background: "rgb(0, 0, 0)" }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, justifyContent: "space-between" }}>
              {/* Logo with Title */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
<Box
      component="img"
      src="https://ml.globenewswire.com/Resource/Download/548c97b5-1c42-44dc-ab50-a987a585bc91"
      alt="Logo"
      width={50}
      height={50}
      sx={{
        width: "50px",
        height: "50px",
        '@media (max-width: 400px)': {
          display: "none",
        },
      }}
    />

                <motion.div
                  animate={{ y: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  style={{
                    display: "flex",
                    gap: "5px",
                    fontSize: isSmallScreen ? "10px" : "inherit",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    cursor: "pointer"
                  }}
                  sx={{  '@media (max-width: 320px)': {
                    width: "10px",
                    height: "10px",
                  },
                  '@media (min-width: 321px) and (max-width: 380px)': {
                    width: "10px",
                    height: "10px",
                  }, }}
                  onClick={() => {
                    if (window.location.pathname === "/") {
                      window.location.reload();
                    } else {
                      navigate("/");
                    }
                   


                  }}
                >
                  {(isSmallScreen ? "VV Case" : "Vibrant Vibe Cases")
                    .split(" ")
                    .map((word, wordIndex) => (
                      <span key={wordIndex}>
                        {word.split("").map((letter, index) => (
                          <motion.span
                            key={index}
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: index * 0.1,
                            }}
                            style={{ display: "inline-block" }}
                          >
                            {letter}
                          </motion.span>
                        ))}
                         
                      </span>
                    ))}
                </motion.div>
              </motion.div>

              {/* Right Menu */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                <Tooltip title="Language" placement="bottom">
                  <Box onClick={handleReloadClick} sx={{ cursor: 'pointer' }}>
                    <Typography>🌐</Typography>
                  </Box>
                </Tooltip>
                <Box sx={{ display: props.customStyles }}>
                  <div id="google_translate_element" />
                  <style>
                    {`
                      #google_translate_element select {
                        background-color: #f5f5f5;
                        border: 2px solid #007bff;
                        border-radius: 8px;
                        padding: 8px;
                        fontSize: 14px;
                        color: #333;
                        outline: none;
                        transition: all 0.3s ease;
                      }
                      #google_translate_element select:hover {
                        border-color: #0056b3;
                      }
                      #google_translate_element select:focus {
                        border-color: #004085;
                        box-shadow: 0 0 8px rgba(0, 91, 187, 0.4);
                      }
                    `}
                  </style>
                </Box>
                {/* Shopping Bag Icon */}
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{
                    transition: "0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 0 10px rgba(255, 165, 0, 0.8)",
                      backgroundColor: "rgba(255, 165, 0, 0.1)",
                      "& svg": {
                        color: "orange",
                      },
                    },
                    "& a": {
                      color: "orange",
                      textDecoration: "none",
                    },
                  }}
                >
                  <Badge badgeContent={cartItemCount} color="secondary">
                    <Box><ShoppingBag /></Box>
                  </Badge>
                </IconButton>

                {/* Logout Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                      border: "2px solid #ff9800",
                      color: "#ff9800",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      transition: "0.3s",
                      background: "rgba(255, 152, 0, 0.1)",
                      boxShadow: "0 0 10px rgba(255, 152, 0, 0.5)",
                      "@media (max-width: 678px)": {
                        display: "none",
                      },
                      "&:hover": {
                        color: "white",
                        backgroundColor: "rgba(255, 152, 0, 0.8)",
                        boxShadow: "0 0 20px rgba(255, 152, 0, 0.9)",
                        "@media (max-width: 678px)": {
                          fontSize: "20px",
                        },
                      },
                      minWidth: "auto",
                      padding: isSmallScreen ? "8px" : "8px 16px",
                    }}
                  >
                    {isSmallScreen ? <LogOut size={10} /> : <span>Logout</span>}
                  </Button>
                </motion.div>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 350,
            background: "rgba(30, 30, 45, 0.98)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ color: "white" }}>Menu</Typography>
            <IconButton color="inherit" onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;