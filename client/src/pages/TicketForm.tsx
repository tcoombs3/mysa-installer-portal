import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';

interface TicketFormData {
  clientName: string;
  email: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const initialFormData: TicketFormData = {
  clientName: '',
  email: '',
  description: '',
  priority: 'medium',
  category: 'general',
};

const TicketForm: React.FC = () => {
  const [formData, setFormData] = useState<TicketFormData>(initialFormData);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call will be implemented here
      setSnackbar({
        open: true,
        message: 'Ticket submitted successfully!',
        severity: 'success',
      });
      setFormData(initialFormData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting ticket. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Submit a Ticket
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Submit Ticket
            </Button>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TicketForm;
