import { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getAllExchanges, deleteExchange, updateExchangeStatus } from '../../../api/exchanges';
import { Exchange } from '../../../types';
import { toast } from 'react-toastify';
import '../../../styles/pages/admin/AdminExchangesPage.css';

export default function AdminExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const response = await getAllExchanges();
      setExchanges(response.data);
    } catch (error) {
      toast.error('Error al cargar intercambios');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este intercambio?')) return;
    try {
      await deleteExchange(id);
      toast.success('Intercambio eliminado correctamente');
      loadExchanges();
    } catch (error) {
      toast.error('Error al eliminar el intercambio');
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await updateExchangeStatus(id, newStatus);
      toast.success('Estado actualizado correctamente');
      loadExchanges();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const term = searchTerm?.toLowerCase() ?? '';

  const filteredExchanges = exchanges.filter(exchange => {
    const requesterName = exchange?.requesterName?.toLowerCase() ?? '';
    const ownerName = exchange?.ownerName?.toLowerCase() ?? '';
    const status = exchange?.status?.toLowerCase() ?? '';

    return (
      requesterName.includes(term) ||
      ownerName.includes(term) ||
      status.includes(term)
    );
  });

  return (
    <div className="admin-products-container">
      <div className="admin-products-content">
        <div className="admin-products-header">
          <Typography variant="h4" className="admin-products-title">
            Gestión de Intercambios
          </Typography>
          <TextField
            placeholder="Buscar intercambios..."
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
                <TableCell>Solicitante</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExchanges.map((exchange) => (
                <TableRow key={exchange.exchangeId}>
                  <TableCell>{exchange.exchangeId}</TableCell>
                  <TableCell>{exchange.requesterName}</TableCell>
                  <TableCell>{exchange.ownerName}</TableCell>
                  <TableCell>
                    {new Date(exchange.exchangeDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(exchange.exchangeId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {exchange.status === 'PENDING' && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleStatusUpdate(exchange.exchangeId, 'ACCEPTED')}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleStatusUpdate(exchange.exchangeId, 'REJECTED')}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
