import { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box 
} from '@mui/material';
import { getAllAddresses } from '../api/addresses';
import type { AddressResponseDTO } from '../types/dtos';

interface AddressSelectorProps {
  onSelect: (addressId: number) => void;
}

export default function AddressSelector({ onSelect }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | ''>('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await getAllAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  return (
    <Box sx={{ minWidth: 300, p: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Dirección</InputLabel>
        <Select
          value={selectedAddress}
          label="Dirección"
          onChange={(e) => setSelectedAddress(e.target.value as number)}
        >
          {addresses.map((address) => (
            <MenuItem key={address.addressId} value={address.addressId}>
              {`${address.street}, ${address.number} - ${address.city}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        fullWidth
        disabled={!selectedAddress}
        onClick={() => selectedAddress && onSelect(selectedAddress)}
      >
        Vincular Dirección
      </Button>
    </Box>
  );
}
