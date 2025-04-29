import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { getUserInvoices, downloadInvoice } from '../../api/invoices';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import type { Invoice } from '../../types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

  const loadInvoices = async () => {
    try {
      const response = await getUserInvoices(user!.userId);
      setInvoices(response.data);
    } catch (error) {
      toast.error('Error al cargar las facturas');
    }
  };

  const handleDownload = async (invoiceId: number) => {
    try {
      await downloadInvoice(invoiceId);
      toast.success('Factura descargada correctamente');
    } catch (error) {
      toast.error('Error al descargar la factura');
    }
  };

  const handleExpand = (invoiceId: number) => {
    setExpandedId(expandedId === invoiceId ? null : invoiceId);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mis Facturas
      </Typography>

      <List>
        {invoices.map((invoice) => (
          <Paper key={invoice.invoiceId} sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                <IconButton onClick={() => handleExpand(invoice.invoiceId)}>
                  <ExpandMoreIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`Factura #${invoice.invoiceId}`}
                secondary={
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={invoice.type}
                      color={invoice.type === 'PURCHASE' ? 'primary' : 'secondary'}
                      size="small"
                    />
                    <Chip
                      label={invoice.status}
                      color={invoice.status === 'PAID' ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography variant="body2" color="primary">
                      {invoice.totalAmount}€
                    </Typography>
                  </Box>
                }
              />
            </ListItem>

            <Collapse in={expandedId === invoice.invoiceId}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Dirección de envío
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${invoice.address.street} ${invoice.address.number}`}
                  <br />
                  {`${invoice.address.city}, ${invoice.address.country}`}
                  <br />
                  {`CP: ${invoice.address.postalCode}`}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Productos
                </Typography>
                <List dense>
                  {invoice.products.map((product) => (
                    <ListItem key={product.productId}>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.price}€`}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(invoice.invoiceId)}
                  >
                    Descargar PDF
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </List>
    </Box>
  );
}
