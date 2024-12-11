import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Switch, 
  TextField, 
  Button, 
  Autocomplete, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio,
  Typography,
  useTheme,
  Box
} from '@mui/material';
import topCategories from '../helpers/top_categories';
import authors from '../helpers/authors';
import time_periods from '../helpers/time_periods';

const SearchDrawer = ({ open, toggleDrawer, applyFilters }) => {
  const theme = useTheme();
  const [timePeriod, setTimePeriod] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [author, setAuthor] = useState('');
  const [filmAdaptation, setFilmAdaptation] = useState(false);

  const handleApplyFilters = () => {
    const filters = {
      timePeriod,
      category: selectedCategory,
      classification: selectedAgeGroup,
      author,
      film: filmAdaptation,
    };
    applyFilters(filters);
  };

  const handleClearFilters = () => {
    setTimePeriod('');
    setSelectedCategory(null);
    setSelectedAgeGroup('');
    setAuthor('');
    setFilmAdaptation(false);
    toggleDrawer(false);
  };

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper
        }
      }}
    >
      <Box
        role="presentation"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        sx={{ 
          width: 250, 
          padding: '10px',
        }}
      >
        <List>
          <ListItem>
            <Typography variant="h4">Select Filters</Typography>
          </ListItem>
          
          <ListItem sx={{ mt: 1 }}>
            <Typography variant="body1">Author</Typography>
          </ListItem>
          <Box sx={{ width: '90%', px: 2 }}>
            <Autocomplete
              disablePortal
              options={authors}
              value={author}
              onChange={(event, newValue) => setAuthor(newValue)}
              renderInput={(params) => <TextField {...params} label="Choose author" fullWidth />}
            />
          </Box>

          <ListItem sx={{ mt: 1 }}>
            <Typography variant="body1">Category</Typography>
          </ListItem>
          <Box sx={{ width: '90%', px: 2, mb: 1 }}>
            <Autocomplete
              disablePortal
              options={topCategories}
              value={selectedCategory}
              onChange={(event, newValue) => setSelectedCategory(newValue)}
              renderInput={(params) => <TextField {...params} label="Choose categories" fullWidth />}
            />
          </Box>

          <ListItem sx={{ mt: 1 }}>
            <Typography variant="body1">Classification</Typography>
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <FormControl component="fieldset" sx={{ ml: 2 }}>
              <RadioGroup
                aria-label="age-group"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
              >
                <FormControlLabel value="Children" control={<Radio />} label="Children" />
                <FormControlLabel value="YA" control={<Radio />} label="YA" />
                <FormControlLabel value="Adult" control={<Radio />} label="Adult" />
              </RadioGroup>
            </FormControl>
          </ListItem>

          <ListItem sx={{ mt: 1 }}>
            <Typography variant="body1">Time Period</Typography>
          </ListItem>
          <Box sx={{ width: '90%', px: 2, mb: 1 }}>
            <Autocomplete
              disablePortal
              options={time_periods}
              value={timePeriod}
              onChange={(event, newValue) => setTimePeriod(newValue)}
              renderInput={(params) => <TextField {...params} label="Choose time period" fullWidth />}
            />
          </Box>

          <ListItem sx={{ mt: 1 }}>
            <Typography variant="body1">Film Adaptation</Typography>
            <Switch onChange={(e) => setFilmAdaptation(e.target.checked)} />
          </ListItem>
        </List>
        
        <Box sx={{ display: 'flex', gap: 1, m: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SearchDrawer;
