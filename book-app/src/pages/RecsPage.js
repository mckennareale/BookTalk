import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Divider, useTheme } from '@mui/material';
import TopCategoriesSection from '../components/TopCategoriesSection';
import MapSection from '../components/MapSection';

import SurpriseMeSection from '../components/SurpriseMeSection';
import BrowseMoreSection from '../components/BrowseMoreSection';
import PeriodLoversSection from '../components/PeriodLoversSection';
import { customFetch } from "../utils/customFetch";
import { useNavigate } from "react-router-dom";
import RecsDrawer from "../components/RecsDrawer";

const RecsPage = () => {
  const theme = useTheme();
  const [visibleSection, setVisibleSection] = useState(0); 
  const sectionRefs = useRef([]); // Store refs for all sections
  const navigate = useNavigate();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerBooks, setDrawerBooks] = useState([]);
  const [drawerTrigger, setDrawerTrigger] = useState(null);

  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [topCategoriesLoading, setTopcategoriesLoading] = useState(false);
  const [topCategories, setTopcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [periodLovers, setPeriodLovers] = useState([]);
  const [periodLoversLoading, setPeriodLoversLoading] = useState(false);

  const [surpriseMeLoading, setSurpriseMeLoading] = useState(false);
  const [surpriseMeBooks, setSurpriseMeBooks] = useState([]);

  const handleMarkerClick = (location_id, city, country) => {
    setSelectedLocation(location_id); 
    setSelectedCity(city);
    setSelectedCountry(country);
    setDrawerTrigger("location");
    const fetchCityBooks = async () => {
      const responseJson = await customFetch(
        `${process.env.REACT_APP_API_BASE}/set_in_location_books_recs?location_id=${location_id}`,
        { method: "GET" },
        navigate
      );
      console.log("City books:", responseJson);
      setDrawerBooks(responseJson.data);
    }
    fetchCityBooks();
    setDrawerOpen(true); 
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log("Category:", category);
    setDrawerTrigger("category");
    const fetchCategoryBooks = async () => {
      const encodedCategory = encodeURIComponent(category);
      const responseJson = await customFetch(
        `${process.env.REACT_APP_API_BASE}/category_books_recs?category=${encodedCategory}`,
        { method: "GET" },
        navigate
      );
      console.log("Category books:", responseJson);
      setDrawerBooks(responseJson.data);
    }
    fetchCategoryBooks();
    setDrawerOpen(true);
  }

  const handleSurpriseMeClick = (category) => {
    setSelectedCategory(category);
    console.log("Surprise me category:", category);
    setDrawerTrigger("category");
    const fetchSurpriseMeBooks = async () => {
      const encodedCategory = encodeURIComponent(category);
      const responseJson = await customFetch(
        `${process.env.REACT_APP_API_BASE}/category_books_recs?category=${encodedCategory}`,
        { method: "GET" },
        navigate
      );
      console.log("Surprise me books:", responseJson);
      setDrawerBooks(responseJson.data);
    }
    fetchSurpriseMeBooks();
    setDrawerOpen(true);
  }
  
  const closeDrawer = () => setDrawerOpen(false);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };


  const sections = [
    {
      component: MapSection,
      name: "MapSection",
      fetchData: async () => {
        try {
          setLocationLoading(true);
          const responseJson = await customFetch(
              `${process.env.REACT_APP_API_BASE}/set_in_location_recs`,
              { method: "GET" },
              navigate
          );
          console.log("Locations recs:", responseJson); 
          setLocations(responseJson || []); 
        } catch (err) {
          console.error("Error fetching location recs:", err.message);
          setError("Failed to load location recs.");
        } finally {
          setLocationLoading(false);
        }
      },
      data: locations,
      loading: locationLoading,
      fetched: false,
      error: error,
      onMarkerClick: handleMarkerClick,
      onCategoryClick: null,
      onTimePeriodClick: null,
    },
    {
      component: TopCategoriesSection,
      name: "TopCategoriesSection",
      fetchData: async () => {
        try {
          setTopcategoriesLoading(true);
          const responseJson = await customFetch(
              `${process.env.REACT_APP_API_BASE}/category_recs?similar=1`,
              { method: "GET" },
              navigate
          );
          console.log("Top categories:", responseJson); 
          setTopcategories(responseJson); 
        } catch (err) {
          console.error("Error fetching category recs:", err.message);
          setError("Failed to load category recs.");
        } finally {
          setTopcategoriesLoading(false);
        }
      },
      data: topCategories,
      loading: topCategoriesLoading,
      fetched: false,
      error: error,
      onMarkerClick: null,
      onCategoryClick: handleCategoryClick,
      onTimePeriodClick: null,
      onSurpriseMeClick: null,
    },
    {
      component: PeriodLoversSection,
      name: "PeriodLoversSection",
      fetchData: async () => {
        try {
          const responseJson = await customFetch(
              `${process.env.REACT_APP_API_BASE}/period_books_rec`,
              { method: "GET" },
              navigate
          );
          console.log("Period books:", responseJson); 
          setPeriodLovers(responseJson); 
          return responseJson;
        } catch (err) {
          console.error("Error fetching period recs:", err.message);
          setError("Failed to load period recs.");
        } finally {
          setPeriodLoversLoading(false);
        }
      },
      data: periodLovers,
      loading: periodLoversLoading,
      fetched: false,
      error: error,
      onMarkerClick: null,
      onCategoryClick: null,
      onPeriodClick: null,
      onSurpriseMeClick: null,
    },
    {
      component: SurpriseMeSection,
      name: "SurpriseMeSection",
      fetchData: async () => {
        if (surpriseMeBooks.length > 0) return;
        
        try {
          console.log("Fetching SurpriseMe books");
          setSurpriseMeLoading(true);
          const responseJson = await customFetch(
            `${process.env.REACT_APP_API_BASE}/category_recs?similar=0`,
            { method: "GET" },
            navigate
          );
          console.log("SurpriseMe results:", responseJson);
          setSurpriseMeBooks(responseJson);
        } catch (err) {
          console.error("Error fetching SurpriseMe recs:", err.message);
          setError("Failed to load SurpriseMe recs.");
        } finally {
          setSurpriseMeLoading(false);
        }
      },
      data: surpriseMeBooks,
      loading: surpriseMeLoading,
      fetched: false,
      error: error,
      onMarkerClick: null,
      onCategoryClick: null,
      onTimePeriodClick: null,
      onSurpriseMeClick: handleSurpriseMeClick
    },
    {
      component: BrowseMoreSection,
      name: "BrowseMoreSection",
      fetchData: null,
      data: null,
      loading: null,
      fetched: false,
      error: null,
      onMarkerClick: null,
      onCategoryClick: null,
      onTimePeriodClick: null,
    },
  ];
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setVisibleSection(index);

              if (!sections[index].fetched && sections[index].fetchData) {
                sections[index].fetched = true;
                sections[index].fetchData()
                  .catch((error) => {
                    console.error(`Error fetching data for : ${sections[index].name}`, error);
                  });
              }
            }
          }

        });
      },
      { threshold: 0.5 } 
    );

    // Observe each section
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // Unobserve each section on cleanup
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <Container disableGutters maxWidth="lg">
      <Box
        sx={{
          // backgroundColor: theme.palette.background.paper,
          // minHeight: '100vh',
          // overflow: 'hidden', 
        }}
      >
        {/* {selectedLocation && <p>{selectedLocation}</p>} */}
        {/* {selectedPeriod && <p>{selectedPeriod}</p>}         */} 

        <RecsDrawer 
          open={drawerOpen} 
          toggleDrawer={toggleDrawer}
          books={drawerBooks} //change to drawerbooks
          drawerTrigger={drawerTrigger}
          city={selectedCity}
          country={selectedCountry}
          location_id={selectedLocation}
          category={selectedCategory}
        />

        {sections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <React.Fragment key={section.name}>
            <Box
              id={`section-${index}`} 
              key={section.name}
              ref={(el) => (sectionRefs.current[index] = el)} // Assign ref
              sx={{
                position: 'relative', // Keep sections stacked
                opacity: visibleSection === index ? 1 : 0, // Fade in/out
                visibility: visibleSection === index ? 'visible' : 'hidden', // Hide inactive sections
                transition: 'opacity 0.5s ease', // Smooth transition
              }}
            >
              <SectionComponent 
              data={sections[index].data}
              error={sections[index].error}
              loading={sections[index].loading}
              onMarkerClick={sections[index].onMarkerClick}
              onCategoryClick={sections[index].onCategoryClick}
              onPeriodClick={sections[index].onPeriodClick}
              onSurpriseMeClick={sections[index].onSurpriseMeClick}
              />
            </Box>

            {index < sections.length - 1 && (
              <Divider
                sx={{
                  width: "80vw", 
                  backgroundColor: theme.palette.divider,
                  height: "2px",  
                  my: 4, // Vertical margin for spacing between sections
                  mx: "auto", // Centers divider horizontally
                }}
              />
            )}
            </React.Fragment>
          );
        })}
      </Box>
    </Container>
  );
};

export default RecsPage;
