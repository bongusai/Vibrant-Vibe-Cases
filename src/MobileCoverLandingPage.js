import React, { Suspense, lazy } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "bootstrap/dist/css/bootstrap.min.css";

// Lazy-load components to improve performance and isolate potential issues
const Header = lazy(() => import("./components/Header"));
const HeroSection = lazy(() => import("./components/HeroSection"));
const USPSection = lazy(() => import("./components/USPSection"));
const ProductShowcase = lazy(() => import("./components/ProductShowcase"));
const CustomerReviews = lazy(() => import("./components/CustomerReviews"));
const LeadCaptureForm = lazy(() => import("./components/LeadCaptureForm"));
const BenefitsSection = lazy(() => import("./components/BenefitsSection"));
const StatisticalEvidence = lazy(() => import("./components/StatisticalEvidence"));
const Footer = lazy(() => import("./components/Footer"));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "#E1E1E1", textAlign: "center" }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message || "Unknown error occurred."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BB86FC",
    },
    secondary: {
      main: "#03DAC6",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E1E1E1",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function MobileCoverLandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <div className="container-fluid p-0">
          <Suspense fallback={<div style={{ color: "#E1E1E1", textAlign: "center", padding: "20px" }}>Loading...</div>}>
            <Header />
            <HeroSection />
            <USPSection />
            <ProductShowcase />
            <CustomerReviews />
            <LeadCaptureForm />
            <BenefitsSection />
            <StatisticalEvidence />
            <Footer />
          </Suspense>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default MobileCoverLandingPage;