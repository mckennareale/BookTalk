import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Switch, TextField, Button, Autocomplete, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import topCategories from '../helpers/top_categories';

const SearchDrawer = ({ open, toggleDrawer, setFilter }) => {
  const [timePeriod, setTimePeriod] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [author, setAuthor] = useState('');
  const [filmAdaptation, setFilmAdaptation] = useState(false);

  const handleApplyFilters = () => {
    // fill in logic here
  };

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      <div
        role="presentation"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        style={{ width: 250, padding: '10px' }}
      >
        <List>
          <ListItem>
            <ListItemText primary="Select Filters" style={{ fontSize: '24px', fontWeight: 'bold' }} />
          </ListItem>
          <ListItem style={{ marginTop: '5px' }}>
            <ListItemText primary="Author" />
          </ListItem>
          <div style={{ width: '100%' }}>
              <Autocomplete
                disablePortal
                options={["Category 1", "Category 2", "Category 3"]}
                value={author}
                onChange={(event, newValue) => setAuthor(newValue)}
                renderInput={(params) => <TextField {...params} label="Choose author" fullWidth />}
              />
            </div>
          <ListItem style={{ marginTop: '5px' }}>
            <ListItemText primary="Category" />
          </ListItem>
          <ListItem style={{ marginBottom: '10px' }}>
            <div style={{ width: '100%' }}>
              <Autocomplete
                disablePortal
                options={topCategories}
                value={selectedCategory}
                onChange={(event, newValue) => setSelectedCategory(newValue)}
                renderInput={(params) => <TextField {...params} label="Choose categories" fullWidth />}
              />
            </div>
          </ListItem>
          <ListItem style={{ marginTop: '5px' }}>
            <ListItemText primary="Classification" />
          </ListItem>
          <ListItem style={{ marginBottom: '10px' }}>
            <FormControl component="fieldset" style={{ marginLeft: '20px' }}>
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
          <ListItem style={{ marginTop: '5px' }}>
            <ListItemText primary="Time Period" />
          </ListItem>
          <ListItem style={{ marginBottom: '10px' }}>
          <div style={{ width: '100%' }}>
              <Autocomplete
                disablePortal
                options={["Category 1", "Category 2", "Category 3"]}
                value={timePeriod}
                onChange={(event, newValue) => setTimePeriod(newValue)}
                renderInput={(params) => <TextField {...params} label="Choose time period" fullWidth />}
              />
            </div>
          </ListItem>
          <ListItem style={{ marginTop: '5px' }}>
            <ListItemText primary="Film Adaptation" />
            <div>
            <Switch onChange={(e) => setFilmAdaptation(e.target.checked)} />
            </div>
          </ListItem>
        </List>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApplyFilters} 
          style={{ margin: '10px' }}
        >
          Apply Filters
        </Button>
      </div>
    </Drawer>
  );
};

export default SearchDrawer;
