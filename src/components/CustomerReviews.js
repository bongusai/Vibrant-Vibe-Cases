import React from "react";
import { Typography, Box, Avatar, Rating, Container, Card, CardContent } from "@mui/material";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const reviews = [
  {
    id: 1,
    name: "Sara Williams",
    rating: 4,
    comment: "Love the design! It fits perfectly and feels premium.",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 2,
    name: "John Doe",
    rating: 4,
    comment: "Fantastic experience, the quality  my expectations.",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Emily Clark",
    rating: 5,
    comment: "Absolutely amazing! Great value for the money.",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
];

function CustomerReviews() {
  return (
    <Box sx={{ py: 12, bgcolor: "#f5f5f5" }}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          textAlign="center"
          sx={{ color: "#333", mb: 8, fontWeight: "bold", fontSize: { xs: "2rem", md: "3rem" } }}
        >
          What Our Customers Say
        </Typography>
        <Carousel
          interval={5000}
          controls
          indicators
          prevIcon={
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{ filter: "invert(0)", backgroundColor: "black", borderRadius: "50%", padding: "15px" }}
            />
          }
          nextIcon={
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{ filter: "invert(0)", backgroundColor: "black", borderRadius: "50%", padding: "15px" }}
            />
          }
        >
          {reviews.map((review) => (
            <Carousel.Item key={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="d-flex justify-content-center"
              >
                <Card
                  sx={{
                    maxWidth: 500,
                    textAlign: "center",
                    p: 3,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                    borderRadius: "20px",
                    transition: "transform 0.3s ease",
                    ":hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <Avatar
                      alt={review.name}
                      src={review.avatar}
                      sx={{ width: 100, height: 100, mx: "auto", mb: 2, border: "3px solid #00796b" }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#00796b", mb: 1, paddingBottom: "20px", }}>
                      {review.name}
                    </Typography>
                    <Rating
                      value={review.rating}
                      readOnly
                      sx={{
                        "& .MuiRating-iconFilled": { color: "#ff9800" },
                        fontSize: "2rem",
                      }}
                    />
                    <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic", color: "#666" }}>
                      "{review.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
}

export default CustomerReviews;
