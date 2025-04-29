import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button, 
  DialogActions
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  GetApp as DownloadIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getAllInvoices, deleteInvoice } from '../../api/invoices';
import { Invoice } from '../../types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/admin/AdminInvoicesPage.css';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      await deleteInvoice(invoiceToDelete);
      toast.success('Factura eliminada correctamente');
      loadInvoices();
    } catch (error) {
      toast.error('Error al eliminar la factura');
    } finally {
      setInvoiceToDelete(null);
    }
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailsOpen(true);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceId.toString().includes(searchTerm)
  );

  return (
    <div className="admin-invoices-container">
      <div className="admin-invoices-content">
        <div className="admin-invoices-header">
          <Typography variant="h4" className="admin-invoices-title">
            Gestión de Facturas
          </Typography>
          <TextField
            placeholder="Buscar facturas..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

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
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.invoiceId}>
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
                      onClick={() => navigate(`/invoices/${invoice.invoiceId}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => setInvoiceToDelete(invoice.invoiceId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(invoice)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Confirmation Dialog */}
        <Dialog open={Boolean(invoiceToDelete)} onClose={() => setInvoiceToDelete(null)}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            ¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInvoiceToDelete(null)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
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
                      secondary={`${selectedInvoice.address.street}, ${selectedInvoice.address.city}`}
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
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
