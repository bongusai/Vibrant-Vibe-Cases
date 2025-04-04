// OrderManagement.js
import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_DIPLOYED_BACKEND_URL || "https://vibrant-vibe-cases.onrender.com/api";

// Static exchange rate (INR to CNY) - Replace with API call in production
const EXCHANGE_RATE_INR_TO_CNY = 0.083;

const OrderManagement = ({ orders, setOrders }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState({});
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

  const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/orders/${orderId}`,
        { orderStatus: newStatus }
      );

      // Update orders in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      alert("Order Updated");

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getPriceDetails = (amount) => {
    const isChinese = selectedLanguage === "zh-TW";
    const currencySymbol = isChinese ? "¥" : "₹";
    const conversionRate = isChinese ? EXCHANGE_RATE_INR_TO_CNY : 1;

    const convertedAmount = (amount * conversionRate).toFixed(2);

    return {
      symbol: currencySymbol,
      convertedAmount,
    };
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Order Management
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              {!isMobile && <TableCell>Customer</TableCell>}
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { symbol, convertedAmount } = getPriceDetails(order.totalAmount);

              return (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id.slice(-6)}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {order.userId.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.userId.email}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>{symbol}{convertedAmount}</TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      size="small"
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={loading[order._id]}
                      sx={{ minWidth: 120 }}
                    >
                      {orderStatuses.map((status) => (
                        <MenuItem key={status} value={status.toLowerCase()}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderManagement;