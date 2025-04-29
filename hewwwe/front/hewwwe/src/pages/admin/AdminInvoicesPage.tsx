import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { getAllInvoices, downloadInvoice } from '../../api/invoices';
import { toast } from 'react-toastify';
import type { Invoice } from '../../types';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await getAllInvoices();
      setInvoices(response.data);
    } catch (error) {
      toast.error('Error al cargar facturas');
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

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailsOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Facturas
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoiceId} hover>
                <TableCell>{invoice.invoiceId}</TableCell>
                <TableCell>{invoice.user.name}</TableCell>
                <TableCell>
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.totalAmount}€</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.type}
                    color={invoice.type === 'PURCHASE' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={invoice.status === 'PAID' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(invoice)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(invoice.invoiceId)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalle de Factura #{selectedInvoice?.invoiceId}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Información General
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Cliente"
                    secondary={selectedInvoice.user.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Fecha"
                    secondary={new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Dirección de Envío"
                    secondary={`${selectedInvoice.address.street} ${selectedInvoice.address.number}, ${selectedInvoice.address.city}`}
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Productos
              </Typography>
              <List>
                {selectedInvoice.products.map(product => (
                  <ListItem key={product.productId}>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.price}€`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Typography variant="h6">
                  Total: {selectedInvoice.totalAmount}€
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(selectedInvoice.invoiceId)}
                >
                  Descargar PDF
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
