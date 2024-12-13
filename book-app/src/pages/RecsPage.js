import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Divider, useTheme } from '@mui/material';
import TopCategoriesSection from '../components/TopCategoriesSection';
import MapSection from '../components/MapSection';
import OtherReadersLoveSection from '../components/OtherReadersLoveSection';
import BrowseMoreSection from '../components/BrowseMoreSection';
import PeriodLoversSection from '../components/PeriodLoversSection';

const RecsPage = () => {
  const theme = useTheme();
  const [visibleSection, setVisibleSection] = useState(0); // Track the current visible section
  const sectionRefs = useRef([]); // Store refs for all sections

  const sections = [
    { component: MapSection, name: 'MapSection' },
    { component: TopCategoriesSection, name: 'TopCategoriesSection' },
    { component: PeriodLoversSection, name: 'PeriodLoversSection' },
    { component: OtherReadersLoveSection, name: 'OtherReadersLoveSection' },
    { component: BrowseMoreSection, name: 'BrowseMoreSection' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(`Section ${entry.target.id} is intersecting: ${entry.isIntersecting}`);
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setVisibleSection(index);
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% of the section is visible
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
          // overflow: 'hidden', // Ensure the entire page scrolls
        }}
      >
        {sections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <React.Fragment key={section.name}>
            <Box
              id={`section-${index}`} // Add an ID for debugging and reference
              key={section.name}
              ref={(el) => (sectionRefs.current[index] = el)} // Assign ref
              sx={{
                position: 'relative', // Keep sections stacked
                opacity: visibleSection === index ? 1 : 0, // Fade in/out
                visibility: visibleSection === index ? 'visible' : 'hidden', // Hide inactive sections
                transition: 'opacity 0.5s ease', // Smooth transition
              }}
            >
              <SectionComponent />
            </Box>

            {index < sections.length - 1 && (
              <Divider
                sx={{
                  width: "80vw", // 80% of the viewport width
                  backgroundColor: theme.palette.divider,
                  height: "2px", // Customize 
                  my: 4, // Vertical margin for spacing between sections
                  mx: "auto", // Centers the divider horizontally
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
