// OrderHistory.js
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Static exchange rate (INR to CNY) - Replace with API call in production
const EXCHANGE_RATE_INR_TO_CNY = 0.083;

const OrderHistory = ({ orders }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return statusColors[status.toLowerCase()] || 'default';
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
        Order History
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              {!isMobile && <TableCell>Customer</TableCell>}
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
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
                        <Typography variant="body2">{order.userId.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.userId.email}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>
                    {symbol}{convertedAmount}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color={getStatusColor(order.orderStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default OrderHistory;