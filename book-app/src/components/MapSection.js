import React, {useEffect, useRef, useState} from "react";
import { Box, Typography } from "@mui/material";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation
  } from "react-simple-maps";
import geoJson from "../helpers/countries-50m.json";



const MapSection = () => {
    const markers = [
        { markerOffset: 15, name: "La Paz", coordinates: [-68.1193, -16.4897] },
        { markerOffset: 15, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
        { markerOffset: 15, name: "Santiago", coordinates: [-70.6693, -33.4489] },
      ];
    //Google by default returns coordinates as [lat, lon], while d3-geo specifies them as [lon, lat].

    const [citySelected, setCitySelected] = useState(null);
    
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
        
        <ComposableMap 
            projection="geoEqualEarth"
            height="500">
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
                        hover: {
                        fill: "#F19C79",
                        },
                }} />
            ))
            }
        </Geographies>
        {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates}>
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
            <text
                textAnchor="middle"
                y={markerOffset}
                style={{ 
                    fontFamily: "'Outfit Variable', sans-serif", 
                    fontSize: "12",
                    fontWeight: "300",
                    fill: "#000000" }}
            >
                {name}
            </text>
            </Marker>
        ))}
        </ComposableMap>
        
        </Box>
        
    )
}

export default MapSection
