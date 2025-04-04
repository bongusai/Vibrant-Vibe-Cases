import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Favorite, LocalShipping, Brush } from "@mui/icons-material";
import { motion } from "framer-motion";

const uspItems = [
  {
    icon: <Favorite sx={{ fontSize: 48, color: "orange" }} />,
    title: "Eco-Friendly",
    description: "Sustainable materials for a greener future",
  },
  {
    icon: <LocalShipping sx={{ fontSize: 48, color: "orange" }} />,
    title: "Free Shipping",
    description: "On all orders over ₹50",
  },
  {
    icon: <Brush sx={{ fontSize: 48, color: "orange" }} />,
    title: "Customizable",
    description: "Design your perfect cover",
  },
];

function USPSection() {
  return (
    <Box
      sx={{
        py: 8,
        backgroundImage:
          "linear-gradient(45deg, rgba(12, 12, 12, 0.88) 30%, rgba(73, 73, 73, 0.9) 90%)",
      }}
    >
      <Grid container spacing={4}>
        {uspItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  height: "100%",
                  borderRadius: 3,
                 
                  backgroundImage:
                      "linear-gradient(45deg, rgba(12, 12, 12, 0.68) 30%, rgba(3, 218, 197, 0.9) 90%)",
                 
                  transition: "0.3s ease-in-out",
                  
                  "&:hover": {
                    background: "rgba(173, 173, 173, 0.5)",
                    boxShadow: "inset 0px 4px 15px rgba(0, 0, 0, 0.5)",
                    color: "white",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                {item.icon}
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ mt: 2, color: "primary.main", transition: "color 0.3s ease-in-out", "&:hover": { color: "white" } }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ transition: "color 0.3s ease-in-out", "&:hover": { color: "white" } }}>
                  {item.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default USPSection;
