import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import mascot from "../assets/mascot.png";
import { customFetch } from "../utils/customFetch";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const setupMaterializedView = async () => {
            try {
                const setupResponse = await customFetch(
                    `${process.env.REACT_APP_API_BASE}/setup_temp_tables`,
                    { method: "GET" },
                    navigate
                );
                console.log("Temp tables loaded:", setupResponse); // Debugging log
            } catch (err) {
                console.error("Error setting up temp tables:", err.message);
            } finally {
                setLoading(false);
                navigate('/');
            }
        };

        setupMaterializedView();
    }, [navigate]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#F5EDE3",
            }}
        >
            {loading ? (
                <>
                    <CircularProgress />
                    <Typography variant="h5" sx={{ marginTop: "20px" }}>
                        Brewing your Backend
                    </Typography>
                </>
            ) : (
                <Typography variant="h5">Setup Complete!</Typography>
            )}
        </Box>
    );
};

export default LoadingPage;