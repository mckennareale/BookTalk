import React, {useEffect, useRef, useState} from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation
  } from "react-simple-maps";
import geoJson from "../helpers/countries-50m.json";
import Tooltip from "@mui/material/Tooltip";

const MapSection = ({ data = [], error, loading, onMarkerClick }) => {

    // if no locations in data, use default location top 5
    let markers = [
        { markerOffset: 20, city: 'New York', country: 'United States',  coordinates: [-73.9249000, 40.6943000], location_id: 1840034016},
        { markerOffset: 20, city: 'London', country: 'United Kingdom', coordinates: [-0.1275000, 51.5072000], location_id: 1826645935},
        { markerOffset: 20, city: 'Los Angeles', country: 'United States', coordinates: [-118.4068000, 34.1141000], location_id: 1840020491},
        { markerOffset: 20, city: 'Paris', country: 'France',  coordinates: [2.3522000, 48.8567000], location_id: 1250015082},
        { markerOffset: 20, city: 'Chicago', country: 'United States', coordinates: [-87.6866000, 41.8375000], location_id: 1840000494},
      ];
    
    if (data.length > 0) {
        markers = data.map((location) => {
            return {
                markerOffset: 20,
                city: location.city,
                country: location.country,
                coordinates: [location.longitude, location.latitude],
                location_id: location.id,
            }
        })
    }
    
    
    return (

        <Box
            flexDirection="column"
            alignItems="flex-start"
            sx={{
            pl: 2,
            pr: 2,
            pt: 5,
            // pb: 10,
            // maxHeight: '100vh',
            overflow: 'auto',
            // backgroundColor: '#ADD8E6', // light blue for dev
            }}
        >   
            <Typography 
            variant="h5" 
            sx={{ 
            color: 'primary.main',
            }}>
            we think you'll like books set in these locations...
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            
            
            <ComposableMap 
                projection="geoEqualEarth"
                height={500}>
                <Geographies
                    geography={geoJson}
                    fill="#D6D6DA"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                >
                    {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography 
                            key={geo.rsmKey} 
                            geography={geo}
                            style={{
                                default: {
                                fill: "#e3e1e1",
                                },
                                // hover: {
                                // fill: "#F19C79",
                                // },
                        }} />
                    ))
                    }
                </Geographies>
                {markers.map(({ city, country, coordinates, markerOffset, location_id }) => (
                    <Tooltip
                        key={city}
                        title={`${city}, ${country}`} 
                        onClick={() => onMarkerClick(
                            location_id, city, country
                        )}
                        arrow 
                    >
                    <Marker 
                        key={city} 
                        coordinates={coordinates}
                        >
                    <g
                        fill="none"
                        stroke="#A44A3F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(-12, -24)"
                    >
                        <circle cx="12" cy="10" r="3" />
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                    </g>
                    </Marker>
                    </Tooltip>
                ))}
            </ComposableMap>
            
        </Box>
        
    )
}

export default MapSection
