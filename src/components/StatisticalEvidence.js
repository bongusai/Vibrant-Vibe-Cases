import React, { useEffect, useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { motion } from "framer-motion";

const stats = [
  { value: 99, label: "Customer Satisfaction", suffix: "%" },
  { value: 100, label: "Unique Designs", suffix: "+" },
  { value: 50, label: "Covers Sold", suffix: "M+" },
];

function StatisticalEvidence() {
  const [countValues, setCountValues] = useState(
    stats.map(() => 1)
  );

  useEffect(() => {
    const updateCountValues = () => {
      const intervalIds = stats.map((stat, index) => {
        let count = 1;
        const intervalId = setInterval(() => {
          if (count < stat.value) {
            count += Math.ceil(stat.value / 100); // Increment the counter in steps
            setCountValues((prevValues) => {
              const newValues = [...prevValues];
              newValues[index] = count;
              return newValues;
            });
          } else {
            clearInterval(intervalId);
          }
        }, 30); // Update the number every 30ms (adjust to match 3 seconds)
        return intervalId;
      });

      // Cleanup intervals
      return () => {
        intervalIds.forEach((id) => clearInterval(id));
      };
    };

    // Call the updateCountValues initially
    updateCountValues();

    const intervalId = setInterval(() => {
      setCountValues(stats.map(() => 1)); // Reset to 1 for the next update
      updateCountValues(); // Start the counter again
    }, 5000); // Reload numbers every 5 seconds

    return () => {
      clearInterval(intervalId); // Cleanup on component unmount
    };
  }, []);

  return (
    <Box sx={{ py: 8, bgcolor: "rgba(253, 215, 206, 0.77)" }}>
      <Typography
        variant="h2"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{ color: "rgba(0, 0, 0, 0.77)", mb: 6 }} // Updated color
      >
        Our Impact
      </Typography>
      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  component="div"
                  gutterBottom
                  sx={{ color: "white", fontWeight: "bold" }} 
                >
                  {countValues[index]}
                  {stat.suffix}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ color: "#333" }} // Updated color
                >
                  {stat.label}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StatisticalEvidence;
