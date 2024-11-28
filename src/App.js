import React, { useState } from "react";
import CodeEditor from "./components/Editor.js"; // Tu editor Monaco
import AnalysisButtons from "./components/AnalysisButtons.js"; // Botones de análisis
import TokenTable from "./components/TokenTable.js"; // Tabla de tokens
import Footer from "./components/Result.js"; // Tabla de errores
import { analyzeLexical } from "./analyzers/lexico.js"; // Importa la lógica del análisis léxico
import { Tabs, Tab, Typography, Grid, Box} from '@mui/material';
import FileUploadButton from './components/FileUploadButton.js';
import TeamModal from './components/TeamModal.js'; // Ajusta la ruta según tu proyecto
const parser = require('./analyzers/sintactico.js'); // Importa el parser directamente

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [code, setCode] = useState(""); // Contenido del editor
    const [tokens, setTokens] = useState([]); // Tokens léxicos
    const [allErrors, setAllErrors] = useState([]); // Unificación de errores léxicos y sintácticos
    const [isLexicalComplete, setLexicalComplete] = useState(false); // Estado del léxico
    const [syntaxTree, setSyntaxTree] = useState(null);
    const [isSemanticAnalysisEnabled, setSemanticAnalysisEnabled] = useState(false); // Estado del análisis semántico
    const [resultado, setResultado] = useState(''); // Mensaje para la consola de resultado
    const [currentTab, setCurrentTab] = useState(0); // Estado para el tab actual

    const clearErrors = () => {
        setAllErrors([]);
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleFileUpload = (fileContent) => {
        setCode(fileContent); // Actualiza el contenido del editor con el contenido del archivo
    };

    {/* Modal */}
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLexicalAnalysis = () => {
        try {
            // Ejecuta la función de análisis léxico con el código actual
            const { tokens: analyzedTokens, errors: analyzedErrors } = analyzeLexical(code);
    
            // Actualiza los estados con los resultados
            setTokens(analyzedTokens); // Actualiza la lista de tokens
            setAllErrors(analyzedErrors); // Actualiza la lista de errores léxicos
    
            // Verifica si hay errores
            if (analyzedErrors.length === 0) {
                setResultado('Análisis Léxico Completado: No se encontraron errores.'); // Mensaje en la consola
                setLexicalComplete(true); // Habilita el botón de análisis sintáctico
            } else {
                setResultado('Análisis Léxico Completado: Se encontraron errores.'); // Mensaje en la consola
                setLexicalComplete(false); // Deshabilita el botón de análisis sintáctico
            }
        } catch (error) {
            // Manejo de errores inesperados en el análisis
            setAllErrors([{ error: error.message, line: '-', column: '-' }]); // Error genérico
            setResultado('Error al ejecutar el análisis léxico.'); // Mensaje en la consola
            setLexicalComplete(false); // Asegura que el flujo no continúe
        }
    };
    
    const handleSyntaxAnalysis = () => {
        try {
            const analysis = analyzeSyntax(code);
            if (analysis.success) {
                setResultado("Análisis Sintáctico Completado: No se encontraron errores.");
                setSyntaxTree(analysis.syntaxTree);
                setAllErrors([]); // Limpia los errores sintácticos
                setSemanticAnalysisEnabled(true); // Habilitar análisis semántico
            } else {
                setResultado("Análisis Sintáctico Completado: Se encontraron errores.");
                const formattedErrors = analysis.errors.map(err => ({
                    error: err.message || "Error no especificado",
                    line: err.line || "-",
                    column: err.column || "-",
                }));
                setAllErrors(prevErrors => [...prevErrors, ...formattedErrors]); // Combina con los errores léxicos
                setSyntaxTree(null); // Vacía el árbol
                setSemanticAnalysisEnabled(false); // Deshabilitar análisis semántico
            }
        } catch (error) {
            setResultado("Error al ejecutar el análisis sintáctico.");
            setAllErrors([{
                error: error.message || "Error desconocido",
                line: "-",
                column: "-",
            }]);
            setSyntaxTree(null);
            setSemanticAnalysisEnabled(false);
        }
    };
    
    const analyzeSyntax = (code) => {
        try {
            const syntaxTree = parser.parse(code); // Usa el parser importado
            return {
                success: true,
                syntaxTree,
            };
        } catch (error) {
            return {
                success: false,
                errors: [{
                    message: error.message || "Error desconocido",
                    line: error.location?.start.line || "-",
                    column: error.location?.start.column || "-",
                }],
            };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#3f555d', color: '#fff' }}>            
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: '#2c4343', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <div style={{ backgroundColor: '#8bb3bf', padding: '10px', display: 'inline-block', borderRadius: '8px' }}>
                    <img src="/logo-tec.png" alt="logo tecnm en Celaya" width="200" />
                </div>    

                <div>
                    {/* El botón para subir archivos */}
                    <FileUploadButton onFileUpload={handleFileUpload} />
                </div>            
                <div>
                    <AnalysisButtons
                        handleLexicalAnalysis={handleLexicalAnalysis}
                        handleSyntaxAnalysis={handleSyntaxAnalysis}
                        handleSemanticAnalysis={() => {}}
                        handleOpenModal={handleOpenModal}
                        isLexicalComplete={isLexicalComplete}
                        isSyntaxComplete={isSemanticAnalysisEnabled}
                    />
                </div>

                <img src='/logo-tec2.png' alt='logo tecnm en celaya' width='100' />
            </header>

            <TeamModal isOpen={isModalOpen} onClose={handleCloseModal} />
            
            {/* Main Content */}
            <Grid item xs={12} md={8}>
                <Box sx={{ padding: 2 }}>
                    <CodeEditor code={code} setCode={setCode} />
                </Box>
            </Grid>

            <Grid item xs={12} md={4}>
                <Box>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        aria-label="Analysis Tabs"
                        textColor="inherit"
                        indicatorColor="secondary"
                        sx={{ backgroundColor: '#2c4343' }}
                    >
                        <Tab label="Tokens" />
                        <Tab label="Árbol Sintáctico" />
                    </Tabs>

                    {currentTab === 0 && <TokenTable tokens={tokens} />}
                    {currentTab === 1 && (
                        <Box sx={{ padding: 2, backgroundColor: '#394a4a', borderRadius: 2 }}>
                            {syntaxTree ? (
                                <pre style={{ color: '#8bb3bf' }}>
                                    {JSON.stringify(syntaxTree, null, 2)}
                                </pre>
                            ) : (
                                <Typography>No se ha generado un árbol sintáctico.</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Grid>

            <Footer
                resultado={resultado} // Mensaje general del resultado
                errors={allErrors} // Combina errores léxicos y sintácticos
                clearErrors={clearErrors} // Función para limpiar los errores
            />
        </div>
    );
};

export default App;
