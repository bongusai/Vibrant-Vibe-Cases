import React, { useEffect } from 'react';
import { Box, Container, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

const AuthLayout = ({ children }) => {
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    const scriptId = "google-translate-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      const element = document.getElementById("google_translate_element");
      if (element && element.innerHTML.trim() === "") {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,zh-TW,zh-HK",
            // Set the previously selected language if it exists
            defaultLanguage: localStorage.getItem('selectedLanguage') || 'en'
          },
          "google_translate_element"
        );

        // Add event listener to detect language change
        const selectElement = element.querySelector('select');
        if (selectElement) {
          selectElement.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            localStorage.setItem('selectedLanguage', selectedLanguage);
          });
        }
      }
    };
  }, []);

  useEffect(() => {
    if (reload) {
      window.location.reload();
      setReload(false);
    }
  }, [reload]);

  const handleReloadClick = () => {
    setReload(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("https://images.pexels.com/photos/960137/pexels-photo-960137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <Tooltip title="Language" placement="bottom">
          <Box
            onClick={handleReloadClick}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Typography>🌐</Typography>
          </Box>
        </Tooltip>

        <Box
          id="google_translate_element"
          sx={{
            '& select': {
              backgroundColor: '#f5f5f5',
              border: '2px solid #007bff',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '14px',
              color: '#333',
              outline: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#0056b3',
              },
              '&:focus': {
                borderColor: '#004085',
                boxShadow: '0 0 8px rgba(0, 91, 187, 0.4)',
              },
            },
          }}
        />
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'black',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '40px 0px 40px 0px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg,rgb(255, 255, 255),rgb(165, 236, 0))',
              opacity: 0.8,
              clipPath: 'polygon(0% 50%, 25% 45%, 50% 50%, 75% 55%, 100% 50%, 100% 100%, 0% 100%)',
              animation: 'zigzagAnimation 6s infinite linear',
            },
            '@keyframes zigzagAnimation': {
              '0%': { transform: 'translateX(-10%) translateY(0px)' },
              '50%': { transform: 'translateX(10%) translateY(10px)' },
              '100%': { transform: 'translateX(-10%) translateY(0px)' },
            },
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;