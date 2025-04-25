import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import type { Address } from '../types';

interface AddressFormProps {
  onSubmit: (address: Partial<Address>) => void;
  initialData?: Partial<Address>;
}

export default function AddressForm({ onSubmit, initialData }: AddressFormProps) {
  const [address, setAddress] = useState<Partial<Address>>(initialData || {
    street: '',
    number: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="Calle"
        name="street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Número"
        name="number"
        value={address.number}
        onChange={(e) => setAddress({ ...address, number: e.target.value })}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Ciudad"
        name="city"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="País"
        name="country"
        value={address.country}
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Código Postal"
        name="postalCode"
        value={address.postalCode}
        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Guardar
      </Button>
    </Box>
  );
}
