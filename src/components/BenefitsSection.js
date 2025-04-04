import React from "react";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";

const benefits = [
  "Advanced Shock Absorption",
  "Antimicrobial Surface",
  "Wireless Charging Compatible",
  "Precision-Cut Design",
  "Lifetime Warranty",
];

function BenefitsSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "background.default", textAlign: "center" }}>
      <Typography
        variant="h2"
        component="h2"
        gutterBottom
        sx={{ color: "primary.main", mb: 6 }}
      >
        Why Choose Us?
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 2,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CheckCircle sx={{ color: "secondary.main", fontSize: 30 }} />
                <Typography variant="h6" color="text.primary">
                  {benefit}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BenefitsSection;
