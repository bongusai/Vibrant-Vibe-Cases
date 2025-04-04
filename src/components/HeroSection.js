import React, { useRef } from "react";
import { Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowBack, ArrowForward } from "@mui/icons-material"; // Icons for buttons
import Video1 from "../assets/video1.mp4";
import Promo1 from "../assets/promo1.webp";
import Promo2 from "../assets/promo2.jpg";
import Promo3 from "../assets/promo3.webp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HeroSection() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false, // Disable default arrows to use custom controls
    appendDots: (dots) => (
      <Box
        sx={{
          position: "absolute",
          bottom: "2%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
      </Box>
    ),
    customPaging: () => (
      <Box
        sx={{
          width: "10px",
          height: "10px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "gray",
          },
        }}
      />
    ),
  };

  const carouselItems = [
    {
      type: "video",
      src: Video1,
      heading: "Elevate Your Device",
      subheading: "Futuristic Protection for Modern Smartphones",
    },
    {
      type: "image",
      src: Promo1,
      heading: "Stylish Designs",
      subheading: "Protect Your Device in Style",
    },
    {
      type: "image",
      src: Promo2,
      heading: "Durable Materials",
      subheading: "Long-lasting Protection for Every Occasion",
    },
    {
      type: "image",
      src: Promo3,
      heading: "Lightweight Covers",
      subheading: "Comfort and Convenience for Daily Use",
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          // marginTop: "4%"
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {carouselItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                height: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Background: Video or Image */}
              {item.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                  }}
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={item.src}
                  alt={item.heading}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                  }}
                />
              )}

              {/* Content Over Video or Image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{
                  zIndex: 1,
                  textAlign: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  padding: "2rem",
                  minHeight: "100vh"
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {item.heading}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    marginTop: 2,
                    textShadow: "1px 1px 5px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {item.subheading}
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="productshowcase"
                    smooth={true}
                    duration={500}
                    offset={-70}
                  >
                    <Button
  variant="contained"
  size="large"
  color="secondary"
  sx={{
    mt: 4,
    py: 1.5,
    px: 3.5,
    fontSize: { xs: "1rem", sm: "1.2rem" },
    borderRadius: "8px",
    textTransform: "capitalize",
    display: "inline-flex",
    border: "2px solid cyan",
    color: "cyan",
    fontWeight: "bold",
    position: "relative",
    overflow: "hidden",
    transition: "0.3s ease-in-out",
    background: "linear-gradient(45deg, rgba(12, 12, 12, 0.88) 30%, rgba(3, 218, 197, 0.9) 90%)",
    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
    "&:hover": {
      color: "white",
      background:
        "linear-gradient(45deg, rgba(255, 140, 0, 0.8) 30%, rgba(255, 69, 0, 0.8) 90%)", // Orange-red gradient on hover
      boxShadow:
        "0 0 20px rgba(255, 140, 0, 0.8), 0 0 40px rgba(255, 69, 0, 0.6)", // Adjusted glow effect
      borderColor: "white",
    },
  }}
>
  Explore Covers
</Button>

                  </Link>
                </motion.div>
              </motion.div>
            </Box>
          ))}
        </Slider>

        {/* Custom Prev and Next Buttons */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "2%",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <Button
            onClick={() => sliderRef.current.slickPrev()}
            variant="contained"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <ArrowBack />
          </Button>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: "2%",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <Button
            onClick={() => sliderRef.current.slickNext()}
            variant="contained"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <ArrowForward />
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default HeroSection;
