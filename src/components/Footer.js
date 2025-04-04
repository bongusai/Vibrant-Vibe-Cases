import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { Box, Grid, Link, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

function Footer() {
  const iconStyle = {
    display: { xs: "none", md: "inline-flex" },
    border: "2px solid orange",
    color: "orange",
    fontSize: "1.8rem", // Reduced size
    fontWeight: "bold",
    textTransform: "uppercase",
    position: "relative",
    overflow: "hidden",
    transition: "0.3s ease-in-out",
    background: "rgba(255, 238, 0, 0.1)",
    boxShadow: "0 0 10px rgba(255, 238, 0, 0.5)",
    borderRadius: "50%",
    padding: "6px", // Reduced padding
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(248, 209, 34, 0.81)",
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6)",
      borderColor: "white",
      transform: "scale(1.1)", // Slight hover scale effect
    },
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        py: 6,
        px: 4,
        mt: 4,
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
      >
        {/* Brand Section */}
        <Grid item xs={12} md={4}>
          <motion.div>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Vibrant vibe case
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, textAlign: 'center' }}>
              Elevating device protection since 2025.
            </Typography>
          </motion.div>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} md={4}>
          <motion.div>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, textAlign: 'center' }}>
              <br />
              Phone:{' '}
              <Link color="inherit">
                +91 98765 78765
              </Link>
            </Typography>
          </motion.div>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} md={4}>
          <motion.div>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Follow Us
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Link href="https://www.facebook.com/" color="inherit" target="_blank" sx={iconStyle}>
                <Facebook fontSize="inherit" />
              </Link>
              <Link href="https://www.instagram.com/" color="inherit" target="_blank" sx={iconStyle}>
                <Instagram fontSize="inherit" />
              </Link>
              <Link href="https://x.com/" color="inherit" target="_blank" sx={iconStyle}>
                <Twitter fontSize="inherit" />
              </Link>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Footer Links */}
      <Box mt={4} textAlign="center">
        <motion.div>
          <Typography variant="body2">
            © {new Date().getFullYear()}{' '}
            <Typography
              component="span"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
        Vibrant vibe case
            </Typography>
            . All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {/* <Link href="#" color="inherit" underline="hover">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="#" color="inherit" underline="hover">
              Terms of Service
            </Link> */}
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Footer;
