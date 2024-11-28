import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

const Footer = ({ resultado, errors, clearErrors }) => {
    return (
        <footer
            style={{
                backgroundColor: '#2c4343', // Verde oscuro
                padding: '20px',
                borderTop: '1px solid #ccc',
                position: 'relative',
                width: '100%',
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10,
                color: '#fff',
                resize: 'vertical',
                overflow: 'auto',
                minHeight: '100px',
                maxHeight: '400px',
            }}
        >
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            padding: 2,
                            borderRadius: 1,
                            backgroundColor: '#4a646a', // Fondo grisáceo con tinte verde
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: '100%',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Resultado */}
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                marginBottom: 2,
                                color: errors.length > 0 ? '#ff6f6f' : '#8bb3bf', // Rojo para errores, verde suave para éxito
                            }}
                        >
                            {resultado || 'No se ha generado ningún resultado aún.'}
                        </Typography>

                        {/* Errores */}
                        {errors.length > 0 ? (
                            <Box>
                                <Typography variant="h6" sx={{ marginBottom: 1, color: '#ff6f6f' }}>
                                    Errores detectados:
                                </Typography>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                    {errors.map((error, index) => (
                                        <li key={index} style={{ marginBottom: '10px' }}>
                                            {/* Mostrar el número del error y su descripción al principio */}
                                            <Typography variant="body2" color="error">
                                                <strong>Error {error.code}:</strong> {error.message || 'Error no especificado'}
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                                <strong>Línea:</strong> {error.line || 'N/A'}, <strong>Columna:</strong> {error.column || 'N/A'}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#8bb3bf' }}>
                                No se encontraron errores.
                            </Typography>
                        )}

                        {/* Botón para limpiar errores */}
                        <Button
                            variant="outlined"
                            sx={{
                                marginTop: 2,
                                color: '#fff',
                                borderColor: '#fff',
                                '&:hover': { backgroundColor: '#8bb3bf', color: '#fff' },
                            }}
                            onClick={clearErrors}
                        >
                            Limpiar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;
