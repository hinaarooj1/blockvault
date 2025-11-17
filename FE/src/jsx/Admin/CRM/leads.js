import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Button,
    IconButton,
    Card,
    CardContent,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Menu,
    MenuItem,
    CircularProgress,
    InputAdornment,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    Stack,
    Badge,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Tabs,
    Tab,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Alert,
    Checkbox as MuiCheckbox,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Divider,
    LinearProgress,
} from "@mui/material";
import {
    Add,
    Search,
    FilterList,
    Download,
    MoreVert,
    Visibility,
    Edit,
    Delete,
    Email,
    Phone,
    Mail,
    BarChart,
    Schedule,
    AttachMoney,
    People,
    CloudUpload,
    Description,
    Close,
    SwapHoriz,
    LocationOn,
    NavigateBefore,
    NavigateNext,
    KeyboardArrowDown,
    KeyboardArrowUp,
    DeleteSweep,
    SelectAll,
    DeselectOutlined,
    Menu as MenuIcon,
    CheckCircle,
    Upload as UploadIcon,
    PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import {
    adminCrmLeadsApi,
    createLeadApi,
    uploadLeadsCsvApi,
    uploadLeadsCsvStreamApi,
    deleteLeadApi,
    deleteLeadsBulkApi,
    deleteAllLeadsApi,
    deleteAllLeadsApiWithProgress,
    updateLeadApi, exportLeadsApi,
    allUsersApi,
    assignLeadsApi,
    activateLeadApi,
    activateLeadsBulkApi,
    initiateCallApi,
    bulkCallLeadsApi,
    scheduleCallApi,
    getCallStatusApi,
    getCallHistoryApi,
    cancelCallApi,
    activateLeadsBulkWithProgress,
    getEmailQueueStatusApi
} from "../../../Api/Service";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar.js";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { debounce } from "../../../utils/debounce";
import io from 'socket.io-client';

// ... (Field mapping configuration and CreateLeadDialog component remain the same)
// Field mapping configuration based on updated schema
const AVAILABLE_FIELDS = [
    { key: 'firstName', label: 'First Name', required: true, description: 'Lead first name' },
    { key: 'lastName', label: 'Last Name', required: true, description: 'Lead last name' },
    { key: 'email', label: 'Email', required: true, description: 'Email address' },
    { key: 'phone', label: 'Phone', required: false, description: 'Phone number' },
    { key: 'country', label: 'Country', required: false, description: 'Country name' },
    { key: 'Brand', label: 'Brand', required: false, description: 'Company brand' },
    { key: 'Address', label: 'Address', required: false, description: 'Physical address' },
    { key: 'status', label: 'Status', required: false, description: 'Lead status (New, Call Back, etc.)' },
];

const STATUS_OPTIONS = ["New", "Call Back", "Not Active", "Active", "Not Interested"];

// Enhanced Create Lead Dialog Component - Memoized for performance
const CreateLeadDialog = memo(({ open, onClose, onLeadCreated, agents, currentUser, allowCsvUpload }) => {

    const [activeStep, setActiveStep] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [manualForm, setManualForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        Brand: "",
        Address: "",
        status: "New",
    });
    const [csvFile, setCsvFile] = useState(null);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [csvPreview, setCsvPreview] = useState([]);
    const [fieldMapping, setFieldMapping] = useState({});
    const [selectedFields, setSelectedFields] = useState({});
    const [uploading, setUploading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [mappingComplete, setMappingComplete] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [uploadProgress, setUploadProgress] = useState({
        total: 0,
        uploaded: 0,
        skipped: 0,
        remaining: 0,
        percentage: 0,
        isUploading: false
    });

    useEffect(() => {
        // Default assigned agent to the creator when dialog opens
        if (open && currentUser?.user?._id) {
            setSelectedAgentId(currentUser.user._id);
        }
    }, [open, currentUser]);

    const steps = ['Choose Method', 'Upload & Map Fields', 'Review & Submit'];

    // Prevent CSV tab when not allowed (subadmin or admin without permission)
    useEffect(() => {
        if (!allowCsvUpload && tabValue === 1) {
            setTabValue(0);
        }
    }, [allowCsvUpload, tabValue]);

    // Initialize selected fields
    useEffect(() => {
        const initialSelectedFields = {};
        AVAILABLE_FIELDS.forEach(field => {
            initialSelectedFields[field.key] = field.required;
        });
        setSelectedFields(initialSelectedFields);
    }, []);

    const handleManualFormChange = (field, value) => {
        setManualForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setCsvFile(file);
            parseCsvHeaders(file);
        } else {
            toast.error('Please select a valid CSV file');
        }
    };

    const parseCsvHeaders = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target.result;
            const lines = csvText.split('\n');
            const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));

            setCsvHeaders(headers);

            // Create preview of first 3 rows
            const previewRows = lines.slice(1, 4).map(line => {
                const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                return row;
            }).filter(row => Object.values(row).some(val => val !== ''));

            setCsvPreview(previewRows);

            // Auto-map fields based on header names
            const autoMapping = {};
            headers.forEach(header => {
                const matchedField = AVAILABLE_FIELDS.find(field =>
                    header.toLowerCase().includes(field.key.toLowerCase()) ||
                    field.key.toLowerCase().includes(header.toLowerCase()) ||
                    header.toLowerCase().includes(field.label.toLowerCase())
                );
                if (matchedField) {
                    autoMapping[matchedField.key] = header;
                }
            });
            setFieldMapping(autoMapping);
        };
        reader.readAsText(file);
    };

    const handleFieldMappingChange = (fieldKey, csvHeader) => {
        setFieldMapping(prev => ({
            ...prev,
            [fieldKey]: csvHeader
        }));
    };

    const handleFieldSelectionChange = (fieldKey, isSelected) => {
        setSelectedFields(prev => ({
            ...prev,
            [fieldKey]: isSelected
        }));

        // If deselecting a field, remove from mapping
        if (!isSelected) {
            setFieldMapping(prev => {
                const newMapping = { ...prev };
                delete newMapping[fieldKey];
                return newMapping;
            });
        }
    };

    const validateFieldMapping = () => {
        // Check if all required fields are mapped
        const requiredFields = AVAILABLE_FIELDS.filter(field => field.required);
        const missingRequired = requiredFields.some(field =>
            selectedFields[field.key] && !fieldMapping[field.key]
        );

        if (missingRequired) {
            toast.error('Please map all required fields');
            return false;
        }

        // Check if at least one field is selected
        const hasSelectedFields = Object.values(selectedFields).some(selected => selected);
        if (!hasSelectedFields) {
            toast.error('Please select at least one field to import');
            return false;
        }

        return true;
    };

    const handleManualSubmit = async () => {
        try {
            setCreating(true);
            const payload = { ...manualForm };
            if (currentUser?.user?.role === 'superadmin' && selectedAgentId) {
                payload.agentId = selectedAgentId;
            }
            const response = await createLeadApi(payload);
            if (response.success) {
                toast.success('Lead created successfully!');
                onLeadCreated();
                onClose();
                resetForm();
            } else {
                toast.error(response.msg || 'Failed to create lead');
            }
        } catch (error) {
            toast.error('Error creating lead');
            console.error('Create lead error:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleCsvUpload = async () => {
        if (!csvFile) {
            toast.error('Please select a CSV file');
            return;
        }

        if (!validateFieldMapping()) {
            return;
        }

        try {
            setUploading(true);
            
            // Initialize progress
            setUploadProgress({
                total: 0,
                uploaded: 0,
                skipped: 0,
                remaining: 0,
                percentage: 0,
                isUploading: true
            });

            const formData = new FormData();
            formData.append('file', csvFile);
            formData.append('fieldMapping', JSON.stringify(fieldMapping));
            formData.append('selectedFields', JSON.stringify(selectedFields));
            formData.append('enableProgress', 'true'); // Enable SSE progress
            if (currentUser?.user?.role === 'superadmin' && selectedAgentId) {
                formData.append('agentId', selectedAgentId);
            }

            // Use the streaming API with progress callback
            await uploadLeadsCsvStreamApi(formData, (eventData) => {
                if (eventData.type === 'start') {
                    setUploadProgress({
                        total: eventData.total,
                        uploaded: 0,
                        skipped: 0,
                        remaining: eventData.total,
                        percentage: 0,
                        isUploading: true
                    });
                } else if (eventData.type === 'progress') {
                    const total = eventData.total || 0;
                    const uploaded = eventData.uploaded || 0;
                    const skipped = eventData.skipped || 0;
                    const remaining = Math.max(0, total - uploaded - skipped);
                    setUploadProgress({
                        total: total,
                        uploaded: uploaded,
                        skipped: skipped,
                        remaining: remaining,
                        percentage: eventData.percentage || 0,
                        isUploading: true
                    });
                } else if (eventData.type === 'complete') {
                    setUploadProgress({
                        total: eventData.data.processed + eventData.data.skipped,
                        uploaded: eventData.data.processed,
                        skipped: eventData.data.skipped,
                        remaining: 0,
                        percentage: 100,
                        isUploading: false
                    });
                    
                    toast.success(eventData.msg);
                    
                    // Show warning if leads were skipped
                    if (eventData.data.skipped > 0) {
                        setTimeout(() => {
                            toast.warning(`${eventData.data.skipped} lead(s) skipped due to duplicate emails`, {
                                autoClose: 5000
                            });
                        }, 500);
                    }
                    
                    // Wait a bit to show 100% completion
                    setTimeout(() => {
                        onLeadCreated();
                        onClose();
                        resetForm();
                    }, 1500);
                } else if (eventData.type === 'error') {
                    toast.error(eventData.message || 'Upload failed');
                    setUploadProgress({
                        total: 0,
                        uploaded: 0,
                        skipped: 0,
                        remaining: 0,
                        percentage: 0,
                        isUploading: false
                    });
                }
            });

        } catch (error) {
            toast.error('Error uploading leads');
            console.error('Upload leads error:', error);
            setUploadProgress({
                total: 0,
                uploaded: 0,
                skipped: 0,
                remaining: 0,
                percentage: 0,
                isUploading: false
            });
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setManualForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            country: "",
            Brand: "",
            Address: "",
            status: "New",
        });
        setCsvFile(null);
        setCsvHeaders([]);
        setCsvPreview([]);
        setFieldMapping({});
        setMappingComplete(false);
        setActiveStep(0);
        setTabValue(0);
        setSelectedAgentId("");
        setUploadProgress({
            total: 0,
            uploaded: 0,
            skipped: 0,
            remaining: 0,
            percentage: 0,
            isUploading: false
        });

        // Reset selected fields to defaults
        const initialSelectedFields = {};
        AVAILABLE_FIELDS.forEach(field => {
            initialSelectedFields[field.key] = field.required;
        });
        setSelectedFields(initialSelectedFields);
    };

    const handleNext = () => {
        if (activeStep === 1 && tabValue === 1) {
            if (!validateFieldMapping()) {
                return;
            }
            setMappingComplete(true);
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="lg" 
            fullWidth
            fullScreen={typeof window !== 'undefined' && window.innerWidth < 600}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Create New Lead</Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {/* Step 1: Choose Method */}
                    <Step>
                        <StepLabel>Choose Creation Method</StepLabel>
                        <StepContent>
                            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                                <Tab label="Manual Entry" />
                                {allowCsvUpload && (
                                <Tab label="CSV Upload" />
                                )}
                            </Tabs>

                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Add a single lead manually by filling out the form
                                    </Typography>
                                    <Button variant="contained" onClick={handleNext}>
                                        Continue with Manual Entry
                                    </Button>
                                </Box>
                            )}

                            {tabValue === 1 && allowCsvUpload && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Upload a CSV file to create multiple leads at once
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUpload />}
                                        sx={{ mb: 2 }}
                                    >
                                        Select CSV File
                                        <input
                                            type="file"
                                            hidden
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                        />
                                    </Button>
                                    {csvFile && (
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Selected: {csvFile.name} ({csvHeaders.length} columns detected)
                                        </Typography>
                                    )}
                                    <Box>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            disabled={!csvFile}
                                        >
                                            Continue with CSV Upload
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </StepContent>
                    </Step>

                    {/* Step 2: Enter Details / Map Fields */}
                    <Step>
                        <StepLabel>
                            {tabValue === 0 ? 'Enter Lead Details' : 'Map CSV Fields'}
                        </StepLabel>
                        <StepContent>
                            {tabValue === 0 ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            value={manualForm.firstName}
                                            onChange={(e) => handleManualFormChange('firstName', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            value={manualForm.lastName}
                                            onChange={(e) => handleManualFormChange('lastName', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={manualForm.email}
                                            onChange={(e) => handleManualFormChange('email', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={manualForm.phone}
                                            onChange={(e) => handleManualFormChange('phone', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            value={manualForm.country}
                                            onChange={(e) => handleManualFormChange('country', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Brand"
                                            value={manualForm.Brand}
                                            onChange={(e) => handleManualFormChange('Brand', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            value={manualForm.Address}
                                            onChange={(e) => handleManualFormChange('Address', e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOn />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={manualForm.status}
                                                label="Status"
                                                onChange={(e) => handleManualFormChange('status', e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Map your CSV columns to the lead fields. Required fields are marked with *
                                    </Alert>

                                    {/* CSV Preview */}
                                    {csvPreview.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                CSV Preview (first 3 rows):
                                            </Typography>
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            {csvHeaders.map(header => (
                                                                <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                                                                    {header}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {csvPreview.map((row, index) => (
                                                            <TableRow key={index}>
                                                                {csvHeaders.map(header => (
                                                                    <TableCell key={header}>
                                                                        {row[header] || '-'}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}

                                    {/* Field Mapping Interface */}
                                    <Typography variant="subtitle2" gutterBottom>
                                        Field Mapping:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {AVAILABLE_FIELDS.map(field => (
                                            <Grid item xs={12} key={field.key}>
                                                <Card variant="outlined">
                                                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                                            <Box display="flex" alignItems="center" gap={2} flex={1}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={selectedFields[field.key] || false}
                                                                            onChange={(e) => handleFieldSelectionChange(field.key, e.target.checked)}
                                                                            disabled={field.required}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Box>
                                                                            <Typography variant="body2" fontWeight="medium">
                                                                                {field.label} {field.required && '*'}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {field.description}
                                                                            </Typography>
                                                                        </Box>
                                                                    }
                                                                />
                                                            </Box>

                                                            {selectedFields[field.key] && (
                                                                <Box display="flex" alignItems="center" gap={1} flex={1}>
                                                                    <SwapHoriz fontSize="small" color="action" />
                                                                    <FormControl size="small" fullWidth>
                                                                        <InputLabel>Map to CSV column</InputLabel>
                                                                        <Select
                                                                            value={fieldMapping[field.key] || ''}
                                                                            label="Map to CSV column"
                                                                            onChange={(e) => handleFieldMappingChange(field.key, e.target.value)}
                                                                        >
                                                                            <MenuItem value="">
                                                                                <em>Select column...</em>
                                                                            </MenuItem>
                                                                            {csvHeaders.map(header => (
                                                                                <MenuItem key={header} value={header}>
                                                                                    {header}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Mapping Summary */}
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="caption" display="block" gutterBottom>
                                            <strong>Mapping Summary:</strong>
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Selected: {Object.values(selectedFields).filter(Boolean).length} fields |
                                            Mapped: {Object.values(fieldMapping).filter(Boolean).length} fields
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button onClick={handleBack} sx={{ mr: 1 }}>
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={
                                        tabValue === 0 && (!manualForm.firstName || !manualForm.lastName || !manualForm.email)
                                    }
                                >
                                    Next
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>

                    {/* Step 3: Review & Submit */}
                    <Step>
                        <StepLabel>Review & Submit</StepLabel>
                        <StepContent>
                            {tabValue === 0 ? (
                                <Box>
                                    <Typography variant="h6" gutterBottom>Review Lead Information</Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}><strong>First Name:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.firstName}</Grid>
                                        <Grid item xs={6}><strong>Last Name:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.lastName}</Grid>
                                        <Grid item xs={6}><strong>Email:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.email}</Grid>
                                        <Grid item xs={6}><strong>Phone:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.phone}</Grid>
                                        <Grid item xs={6}><strong>Country:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.country}</Grid>
                                        <Grid item xs={6}><strong>Brand:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.Brand}</Grid>
                                        <Grid item xs={6}><strong>Address:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.Address}</Grid>
                                        <Grid item xs={6}><strong>Status:</strong></Grid>
                                        <Grid item xs={6}>{manualForm.status}</Grid>
                                    </Grid>
                                </Box>
                            ) : (
                                <Box>
                                    {!uploadProgress.isUploading && uploadProgress.percentage === 0 ? (
                                        <>
                                            <Typography variant="h6" gutterBottom>Ready to Upload</Typography>
                                            <Typography variant="body2" gutterBottom>
                                                You are about to upload <strong>{csvFile?.name}</strong> with the following mapping:
                                            </Typography>

                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                {AVAILABLE_FIELDS.filter(field => selectedFields[field.key] && fieldMapping[field.key]).map(field => (
                                                    <Typography key={field.key} variant="body2" sx={{ mb: 1 }}>
                                                        <strong>{field.label}:</strong> {fieldMapping[field.key]}
                                                    </Typography>
                                                ))}
                                            </Box>

                                            <Alert severity="warning" sx={{ mt: 2 }}>
                                                This will import {csvPreview.length > 0 ? 'multiple' : 'all'} leads from the CSV file. Duplicate emails will be skipped automatically.
                                            </Alert>
                                        </>
                                    ) : (
                                        <Box>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <UploadIcon color="primary" />
                                                Uploading Leads...
                                            </Typography>
                                            
                                            <Box sx={{ mt: 3, mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Progress
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                                        {uploadProgress.percentage}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={uploadProgress.percentage} 
                                                    sx={{ 
                                                        height: 10, 
                                                        borderRadius: 5,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 5,
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                                <Grid item xs={12} sm={3}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'success.light', borderColor: 'success.main' }}>
                                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                            <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                                                            <Typography variant="h5" fontWeight="bold">
                                                                {uploadProgress.uploaded}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Uploaded
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'warning.light', borderColor: 'warning.main' }}>
                                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                            <CircularProgress size={32} sx={{ mb: 1 }} />
                                                            <Typography variant="h5" fontWeight="bold">
                                                                {uploadProgress.remaining}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Remaining
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'error.light', borderColor: 'error.main' }}>
                                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                            <Close color="error" sx={{ fontSize: 32, mb: 1 }} />
                                                            <Typography variant="h5" fontWeight="bold">
                                                                {uploadProgress.skipped}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Skipped (Duplicates)
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'info.light', borderColor: 'info.main' }}>
                                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                            <Description color="info" sx={{ fontSize: 32, mb: 1 }} />
                                                            <Typography variant="h5" fontWeight="bold">
                                                                {uploadProgress.total}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Total Leads
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>

                                            {uploadProgress.skipped > 0 && (
                                                <Alert severity="warning" sx={{ mt: 2 }}>
                                                    <strong>{uploadProgress.skipped} lead(s) skipped</strong> due to duplicate email addresses. These leads already exist in the system.
                                                </Alert>
                                            )}

                                            {uploadProgress.percentage === 100 && (
                                                <Alert severity="success" sx={{ mt: 2 }}>
                                                    Upload completed successfully! {uploadProgress.uploaded} lead(s) added{uploadProgress.skipped > 0 ? `, ${uploadProgress.skipped} skipped` : ''}. The dialog will close automatically.
                                                </Alert>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button 
                                    onClick={handleBack} 
                                    sx={{ mr: 1 }}
                                    disabled={uploadProgress.isUploading}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={tabValue === 0 ? handleManualSubmit : handleCsvUpload}
                                    disabled={creating || uploading || uploadProgress.isUploading}
                                >
                                    {creating || uploading || uploadProgress.isUploading ? <CircularProgress size={24} /> : 'Submit'}
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                </Stepper>
                {currentUser?.user?.role === 'superadmin' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Assign to Agent</Typography>
                        <FormControl fullWidth size="small">
                            <InputLabel>Agent</InputLabel>
                            <Select
                                value={selectedAgentId}
                                label="Agent"
                                onChange={(e) => setSelectedAgentId(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Unassigned</em>
                                </MenuItem>
                                {agents
                                    .filter(a => a.role === 'admin' || a.role === 'subadmin' || a.role === 'superadmin')
                                    .map(agent => (
                                        <MenuItem key={agent._id} value={agent._id}>
                                            {agent.firstName} {agent.lastName} ({agent.role}) - {agent.email}{currentUser?.user?._id === agent._id ? ' (self)' : ''}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
});

// View Details Component - Memoized for performance
const LeadDetails = memo(({ lead, open, onClose, navigate }) => {
    if (!lead) return null;

    const handleViewStream = () => {
        onClose();
        navigate(`/admin/crm/lead/${lead._id}/stream`);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            fullScreen={typeof window !== 'undefined' && window.innerWidth < 600}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Lead Details</Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{lead.firstName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{lead.lastName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, wordBreak: 'break-all', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            <Email fontSize="small" />
                            <Typography 
                                component="a"
                                href={`mailto:${lead.email}`}
                                variant="body1"
                                sx={{
                                    color: "primary.main",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                }}
                            >
                                {lead.email}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, wordBreak: 'break-word' }}>
                            <Phone fontSize="small" />
                            <Typography 
                                component="a"
                                href={`tel:${lead.phone}`}
                                variant="body1"
                                sx={{
                                    color: lead.phone ? "primary.main" : "text.secondary",
                                    textDecoration: "none",
                                    cursor: lead.phone ? "pointer" : "default",
                                    "&:hover": {
                                        textDecoration: lead.phone ? "underline" : "none"
                                    }
                                }}
                            >
                                {lead.phone || 'Not provided'}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Country</Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{lead.country || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Brand</Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{lead.Brand || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, wordBreak: 'break-word' }}>
                            <LocationOn fontSize="small" />
                            {lead.Address || 'Not provided'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Chip
                            label={lead.status}
                            color={
                                lead.status === 'Active' ? 'success' :
                                    lead.status === 'Call Back' ? 'warning' :
                                        lead.status === 'Not Active' ? 'error' : 'primary'
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Created Date</Typography>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {new Date(lead.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                    </Grid>
                    {lead.notes && lead.notes.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Notes
                            </Typography>
                            <List dense>
                                {lead.notes.map((note, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={note.text}
                                            secondary={`By ${note.author?.firstName || 'Unknown'} on ${new Date(note.createdAt).toLocaleDateString()}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button 
                    variant="contained" 
                    onClick={handleViewStream}
                    startIcon={<Visibility />}
                >
                    View Stream
                </Button>
            </DialogActions>
        </Dialog>
    );
});

// Edit Lead Component - Memoized for performance
const EditLeadDialog = memo(({ lead, open, onClose, onLeadUpdated }) => {

    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        Brand: "",
        Address: "",
        status: "New",
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (lead) {
            setEditForm({
                firstName: lead.firstName || "",
                lastName: lead.lastName || "",
                email: lead.email || "",
                phone: lead.phone || "",
                country: lead.country || "",
                Brand: lead.Brand || "",
                Address: lead.Address || "",
                status: lead.status || "New",
            });
        }
    }, [lead]);

    const handleEditFormChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdateLead = async () => {
        try {
            setUpdating(true);
            const response = await updateLeadApi(lead._id, editForm);
            if (response.success) {
                toast.success('Lead updated successfully!');
                onLeadUpdated();
                onClose();
            } else {
                toast.error(response.msg || 'Failed to update lead');
            }
        } catch (error) {
            toast.error('Error updating lead');
            console.error('Update lead error:', error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            fullScreen={typeof window !== 'undefined' && window.innerWidth < 600}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Edit Lead</Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={editForm.firstName}
                            onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={editForm.lastName}
                            onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => handleEditFormChange('email', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={editForm.phone}
                            onChange={(e) => handleEditFormChange('phone', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Country"
                            value={editForm.country}
                            onChange={(e) => handleEditFormChange('country', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Brand"
                            value={editForm.Brand}
                            onChange={(e) => handleEditFormChange('Brand', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            value={editForm.Address}
                            onChange={(e) => handleEditFormChange('Address', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={editForm.status}
                                label="Status"
                                onChange={(e) => handleEditFormChange('status', e.target.value)}
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleUpdateLead}
                    disabled={updating || !editForm.firstName || !editForm.lastName || !editForm.email}
                >
                    {updating ? <CircularProgress size={24} /> : 'Update Lead'}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

const LeadsPage = () => {

    let authUser = useAuthUser();
    let navigate = useNavigate();
    useEffect(() => {
        if (authUser().user.role === "user") {
            navigate("/dashboard");
            return;
        }

    }, []);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        country: "",
        agent: "",
    });
    // Temporary search value (not applied until Search button is clicked)
    const [tempSearch, setTempSearch] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalLeads: 0,
        totalFiltered: 0,
        limit: 50,  // Reduced from 100 for better performance
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [countries, setCountries] = useState([
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
        "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
        "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
        "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
        "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
        "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
        "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
        "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
        "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
        "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
        "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North",
        "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
        "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
        "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
        "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
        "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
        "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
        "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
        "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
        "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
        "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
        "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain",
        "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
        "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
        "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
        "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
        "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
        "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileMenu, setisMobileMenu] = useState(false) // Start with false (closed) on mobile
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // Mobile: close sidebar by default
                setisMobileMenu(false);
                setIsSidebarCollapsed(false);
            } else {
                // Desktop: open sidebar by default
                setisMobileMenu(true);
            }
        };

        // Run once on mount
        handleResize();

        // Add event listener for screen resize
        window.addEventListener("resize", handleResize);

        // Cleanup listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState(new Set());
    const [callStatuses, setCallStatuses] = useState({}); // Track call status per lead
    const [socket, setSocket] = useState(null);
    const [expandedLead, setExpandedLead] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteType, setDeleteType] = useState(''); // 'single', 'bulk', 'all'
    const [deleting, setDeleting] = useState(false);
    const [activating, setActivating] = useState(false); // Track activation state
    const [activateConfirmOpen, setActivateConfirmOpen] = useState(false); // Confirmation dialog
    const [activationModalOpen, setActivationModalOpen] = useState(false); // Blocking modal for activation
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true); // Option to send welcome email
    const [activationProgress, setActivationProgress] = useState({
        total: 0,
        activated: 0,
        skipped: 0,
        failed: 0,
        percentage: 0,
        msg: 'Starting...',
        completed: false
    });
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [emailQueueStatus, setEmailQueueStatus] = useState({
        pending: 0,
        processing: 0,
        failed: 0,
        total: 0
    });
    const [deleteProgress, setDeleteProgress] = useState({
        total: 0,
        deleted: 0,
        percentage: 0,
        isProcessing: false,
        msg: ''
    });

    // ✅ Socket.io connection for real-time email queue updates and call status
    useEffect(() => { 
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
        
        // Parse URL properly to avoid malformed URLs
        let backendUrl;
        try {
            const url = new URL(apiUrl);
            backendUrl = `${url.protocol}//${url.host}`; // Get protocol + host only
        } catch (e) {
            console.error('Invalid REACT_APP_API_URL:', apiUrl);
            backendUrl = 'http://localhost:4000'; // Fallback
        }
        
        const socket = io(backendUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'] // Better compatibility
        });

        socket.on('connect', () => {});

        socket.on('emailQueueUpdate', (data) => {setEmailQueueStatus({
                pending: data.pending || 0,
                processing: data.processing || 0,
                failed: data.failed || 0,
                total: data.total || 0
            });
        });

        // Call status updates
        socket.on('call:status:update', (data) => {
            if (data.leadId) {
                setCallStatuses(prev => ({
                    ...prev,
                    [data.leadId]: data.status
                }));
            }
        });

        // Call summary ready
        socket.on('call:summary:ready', (data) => {
            if (data.leadId) {
                toast.success(`Call summary ready for lead`);
                // Refresh leads to show updated call history
                fetchLeads(pagination.currentPage);
            }
        });

        // Bulk call progress
        socket.on('bulk:call:progress', (data) => {
            toast.info(`Bulk call progress: ${data.completed}/${data.total}`);
        });

        setSocket(socket);

        socket.on('disconnect', () => {});

        // Fetch initial status
        getEmailQueueStatusApi().then(response => {
            if (response.success) {
                setEmailQueueStatus({
                    pending: response.data.pending || 0,
                    processing: response.data.processing || 0,
                    failed: response.data.failed || 0,
                    total: response.data.total || 0
                });
            }
        }).catch(err => {
            console.error('Error fetching email queue status:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Toggle sidebar
    const currentAuthUser = authUser();
    const getAllUsers = useCallback(async () => {
        try {
            const currentUser = authUser().user;// Fetch current user's latest data (with their own role to get permissions)// ✅ SECURITY: Fetch current user's latest data BY ID (not email to avoid duplicates)
            const currentUserResponse = await allUsersApi({ 
                search: currentUser._id,  // Search by ID instead of email!
                limit: 1 
            });if (!currentUserResponse.success || currentUserResponse.allUsers.length === 0) {
                toast.error("Failed to fetch user data");
                setCurrentUserLatest(currentUser);
                return;
            }

            const updatedCurrentUser = currentUserResponse.allUsers[0];setCurrentUserLatest(updatedCurrentUser);

            // Check CRM access permissions and redirect if false
            if (updatedCurrentUser.role === "admin") {
                if (!updatedCurrentUser.adminPermissions?.accessCrm) {
                    navigate("/admin/dashboard");
                    return;
                }
            } else if (updatedCurrentUser.role === "subadmin") {
                if (!updatedCurrentUser.permissions?.accessCrm) {
                    navigate("/admin/dashboard");
                    return;
                }
            }

            let agents = []; // Initialize agents array

            // Fetch agents based on user role and permissions
            if (updatedCurrentUser.role === "superadmin") {
                // Superadmin can see all admins, subadmins, and superadmins
                const [adminsResponse, subadminsResponse] = await Promise.all([
                    allUsersApi({ role: 'admin', limit: 1000 }),
                    allUsersApi({ role: 'subadmin', limit: 1000 })
                ]);

                const allFetchedAgents = [
                    ...(adminsResponse.success ? adminsResponse.allUsers : []),
                    ...(subadminsResponse.success ? subadminsResponse.allUsers : [])
                ];

                // ✅ DEDUPLICATION: Check if current user already exists in fetched agents
                const currentUserExists = allFetchedAgents.some(agent => agent._id === updatedCurrentUser._id);
                
                agents = currentUserExists 
                    ? allFetchedAgents 
                    : [...allFetchedAgents, updatedCurrentUser]; // Include self only if not already present
                    
            } else if (updatedCurrentUser.role === "admin") {
                // Admin: can assign only if allowed, and targets restricted to subadmins
                if (updatedCurrentUser.adminPermissions?.canManageCrmLeads) {
                    const subadminsResponse = await allUsersApi({ role: 'subadmin', limit: 1000 });
                    agents = subadminsResponse.success ? subadminsResponse.allUsers : [];
                } else {
                    agents = [];
                }
            } else {
                agents = [];
            }

            setAgents(agents); // Set the agents state

        } catch (error) {
            toast.error(error.message || "Error fetching users");
        }
    }, []); // ✅ EMPTY dependencies - only run once on mount
    
    useEffect(() => {
        getAllUsers();
    }, []); // ✅ EMPTY dependencies - only call getAllUsers once on mount
    const [agents, setAgents] = useState([]);
    const [currentUserLatest, setCurrentUserLatest] = useState(null);

    // Fetch leads with filters and pagination
    const fetchLeads = async (page = 1, limit = pagination.limit) => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page,
                limit
            };

            const res = await adminCrmLeadsApi({ params });

            if (res.success) {
                setLeads(res.data.leads || []);
                setPagination(res.data.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalLeads: 0,
                    totalFiltered: 0,
                    limit: limit,
                    hasNextPage: false,
                    hasPrevPage: false,
                });
                setSelectedLeads(new Set()); // Clear selection on new fetch
            } else {
                toast.error(res.msg || 'Failed to fetch leads');
                setLeads([]);
                setPagination(prev => ({ ...prev, currentPage: 1, totalPages: 1 }));
            }
        } catch (err) {
            console.error("Error fetching leads:", err);
            toast.error('Error fetching leads');
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            setCountries([]);
            setAgents([]);
        } catch (err) {
            console.error("Error fetching dropdown data:", err);
        }
    };

    useEffect(() => {
        fetchLeads(1); // Reset to page 1 when filters change
    }, [filters]);

    const handleLeadCreated = () => {
        fetchLeads(pagination.currentPage);
    };

    const handleLeadUpdated = () => {
        fetchLeads(pagination.currentPage);
    };

    // Call handlers
    const handleCallLead = async (lead) => {
        if (!lead.phone) {
            toast.error('Lead has no phone number');
            return;
        }

        try {
            setCallStatuses(prev => ({ ...prev, [lead._id]: 'ringing' }));
            const response = await initiateCallApi(lead._id, lead.phone);
            if (response.success) {
                toast.success(`Calling ${lead.firstName} ${lead.lastName}...`);
            } else {
                toast.error(response.msg || 'Failed to initiate call');
                setCallStatuses(prev => ({ ...prev, [lead._id]: null }));
            }
        } catch (error) {
            console.error('Error initiating call:', error);
            toast.error('Failed to initiate call');
            setCallStatuses(prev => ({ ...prev, [lead._id]: null }));
        }
    };

    const handleBulkCall = async () => {
        if (selectedLeads.size === 0) {
            toast.error('Please select leads to call');
            return;
        }

        const selectedLeadIds = Array.from(selectedLeads);
        const leadsToCall = leads.filter(lead => selectedLeadIds.includes(lead._id) && lead.phone);

        if (leadsToCall.length === 0) {
            toast.error('Selected leads have no phone numbers');
            return;
        }

        try {
            const response = await bulkCallLeadsApi(selectedLeadIds, { delay: 5000 });
            if (response.success) {
                toast.success(`Queued ${response.calls.length} calls`);
            } else {
                toast.error(response.msg || 'Failed to initiate bulk calls');
            }
        } catch (error) {
            console.error('Error initiating bulk calls:', error);
            toast.error('Failed to initiate bulk calls');
        }
    };

    // Selection handlers
    const handleSelectAll = () => {
        if (selectedLeads.size === leads.length) {
            setSelectedLeads(new Set());
        } else {
            setSelectedLeads(new Set(leads.map(lead => lead._id)));
        }
    };

    const handleSelectLead = useCallback((leadId) => {
        setSelectedLeads(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(leadId)) {
                newSelected.delete(leadId);
            } else {
                newSelected.add(leadId);
            }
            return newSelected;
        });
    }, []);

    // Delete handlers
    const handleDeleteClick = (type, lead = null) => {
        setDeleteType(type);
        setSelectedLead(lead);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleting(true);
            let response;

            switch (deleteType) {
                case 'single':
                    response = await deleteLeadApi(selectedLead._id);
                    if (response.success) {
                        toast.success(response.msg || 'Lead deleted successfully');
                        fetchLeads(pagination.currentPage);
                    } else {
                        toast.error(response.msg || 'Failed to delete lead');
                    }
                    break;
                    
                case 'bulk':
                    response = await deleteLeadsBulkApi(Array.from(selectedLeads));
                    if (response.success) {
                        toast.success(response.msg || 'Leads deleted successfully');
                        fetchLeads(pagination.currentPage);
                    } else {
                        toast.error(response.msg || 'Failed to delete leads');
                    }
                    break;
                    
                case 'all':
                    // Use progress tracking for delete all
                    setDeleteProgress({
                        total: 0,
                        deleted: 0,
                        percentage: 0,
                        isProcessing: true,
                        msg: 'Starting deletion...'
                    });

                    await deleteAllLeadsApiWithProgress((progressData) => {
                        if (progressData.type === 'start') {
                            setDeleteProgress({
                                total: progressData.total,
                                deleted: 0,
                                percentage: 0,
                                isProcessing: true,
                                msg: progressData.msg || 'Starting deletion...'
                            });
                        } else if (progressData.type === 'progress') {
                            setDeleteProgress({
                                total: progressData.total,
                                deleted: progressData.deleted,
                                percentage: progressData.percentage,
                                isProcessing: true,
                                msg: progressData.msg || `Deleting ${progressData.deleted} of ${progressData.total}...`
                            });
                        } else if (progressData.type === 'complete') {
                            setDeleteProgress({
                                total: progressData.total,
                                deleted: progressData.deleted,
                                percentage: 100,
                                isProcessing: false,
                                msg: progressData.msg || 'Deletion complete!'
                            });
                            toast.success(progressData.msg || 'All leads deleted successfully');
                            setTimeout(() => {
                                fetchLeads(1); // Reset to page 1
                                setDeleteConfirmOpen(false);
                                setDeleting(false);
                            }, 1000);
                            return; // Exit early to prevent finally block
                        } else if (progressData.type === 'error') {
                            toast.error(progressData.message || 'Failed to delete leads');
                            setDeleteProgress({
                                ...deleteProgress,
                                isProcessing: false
                            });
                        }
                    });
                    return; // Exit early for 'all' type to handle in progress callback
                    
                default:
                    return;
            }

        } catch (error) {
            toast.error('Error deleting leads');
            console.error('Delete leads error:', error);
            setDeleteProgress({
                ...deleteProgress,
                isProcessing: false
            });
        } finally {
            if (deleteType !== 'all') {
                setDeleting(false);
                setDeleteConfirmOpen(false);
                setSelectedLead(null);
                setDeleteType('');
            }
        }
    };

    // Menu handlers
    const handleMenuOpen = (event, lead) => {
        setAnchorEl(event.currentTarget);
        setSelectedLead(lead);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedLead(null);
    };

    const handleViewDetails = () => {
        setViewDetailsOpen(true);
        setAnchorEl(null);
    };

    const handleEditLead = () => {
        setEditDialogOpen(true);
        setAnchorEl(null);
    };

    const handleDeleteLead = () => {
        handleDeleteClick('single', selectedLead);
        setAnchorEl(null);
    };

    // Activation handlers
    const handleActivateLead = async () => {
        const lead = selectedLead;
        setAnchorEl(null);

        try {
            const response = await activateLeadApi(lead._id);
            if (response.success) {
                toast.success(response.msg || 'Lead activated successfully!');
                fetchLeads(pagination.currentPage, pagination.limit);
            } else {
                toast.error(response.msg || 'Failed to activate lead');
            }
        } catch (error) {
            console.error('Activation error:', error);
            toast.error(error.response?.data?.msg || 'Failed to activate lead');
        }
    };

    const handleBulkActivate = async () => {
        const leadIds = Array.from(selectedLeads);
        
        if (leadIds.length === 0) {
            toast.warning('No leads selected');
            return;
        }

        // Close confirmation dialog
        setActivateConfirmOpen(false);
        
        // Open blocking modal
        setActivationModalOpen(true);
        setActivationProgress({
            total: leadIds.length,
            activated: 0,
            skipped: 0,
            failed: 0,
            percentage: 0,
            msg: 'Starting user creation...',
            completed: false
        });

        try {
            // Call API with progress callback - Pass sendWelcomeEmail option
            const result = await activateLeadsBulkWithProgress(leadIds, sendWelcomeEmail, (progressData) => {
                // Update modal progress in real-time
                setActivationProgress({
                    total: progressData.total || leadIds.length,
                    activated: progressData.activated || 0,
                    skipped: progressData.skipped || 0,
                    failed: progressData.failed || 0,
                    percentage: progressData.percentage || 0,
                    msg: progressData.msg || 'Processing...',
                    completed: progressData.completed || false
                });
            });

            // Close modal
            setActivationModalOpen(false);
            
            // Refresh leads table
            fetchLeads(pagination.currentPage, pagination.limit);
            setSelectedLeads(new Set()); // Clear selection

            // Show skipped users toast if any
            if (result.skippedUsers && result.skippedUsers.length > 0) {
                setTimeout(() => {
                    toast.warning(
                        `⚠️ ${result.skippedUsers.length} User(s) Already Exist in the system`,
                        { 
                            autoClose: 8000
                        }
                    );
                }, 1500);
            }

            // If emails were not sent, download CSV with credentials
            if (!sendWelcomeEmail && result.credentials && result.credentials.length > 0) {
                // Generate CSV content
                const csvHeaders = ['Email', 'Password', 'First Name', 'Last Name', 'Status'];
                const csvRows = result.credentials.map(cred => [
                    cred.email,
                    cred.password,
                    cred.firstName || '',
                    cred.lastName || '',
                    'Active'
                ]);

                // Combine headers and rows
                const csvContent = [
                    csvHeaders.join(','),
                    ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
                ].join('\n');

                // Create and download CSV file
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `user-credentials-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success(
                    `✅ ${result.activated} users created successfully! Credentials CSV downloaded.`,
                    { autoClose: 6000 }
                );
                setTimeout(() => {
                    toast.info(
                        '📥 User credentials have been downloaded. Please share them securely with the users.',
                        { autoClose: 5000 }
                    );
                }, 1000);
            } else if (sendWelcomeEmail) {
                // Show success toast with email info
                const emailsQueued = result.emailsQueued || 0;
                if (emailsQueued > 0) {
                    toast.success(
                        `✅ ${result.activated} users created successfully! ${emailsQueued} welcome emails are being sent in the background.`,
                        { autoClose: 6000 }
                    );
                    setTimeout(() => {
                        toast.info(
                            '📧 Check the Email Queue page to monitor email sending progress.',
                            { autoClose: 5000 }
                        );
                    }, 1000);
                } else {
                    toast.success(
                        `✅ ${result.activated} users created successfully!`,
                        { autoClose: 6000 }
                    );
                }
            }

        } catch (error) {
            console.error('❌ Bulk activation error:', error);
            setActivationModalOpen(false);
            toast.error(error.message || 'Failed to activate leads');
        }
    };

    // Pagination handlers (remain the same)
    const handlePageChange = (event, newPage) => {
        fetchLeads(newPage);
    };

    const handleLimitChange = (event) => {
        const newLimit = parseInt(event.target.value);
        setPagination(prev => ({ ...prev, limit: newLimit }));
        fetchLeads(1, newLimit);
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            fetchLeads(pagination.currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (pagination.hasPrevPage) {
            fetchLeads(pagination.currentPage - 1);
        }
    };

    const getStatusChip = useCallback((status) => {
        const statusColors = {
            New: { color: "primary", variant: "outlined" },
            "Call Back": { color: "warning", variant: "outlined" },
            "Not Active": { color: "error", variant: "outlined" },
            "Active": { color: "success", variant: "filled" },
            "Not Interested": { color: "default", variant: "outlined" },
        };

        const config = statusColors[status] || statusColors.New;

        return (
            <Chip
                label={status}
                color={config.color}
                variant={config.variant}
                size="small"
                sx={{ fontWeight: 600 }}
            />
        );
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, []);

    const handleFilterChange = useCallback((field, value) => {
        // For search field, only update temporary search
        if (field === 'search') {
            setTempSearch(value);
            return;
        }
        
        // For other filters, apply immediately
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    // Handle search button click
    const handleSearch = useCallback(() => {
        setFilters((prev) => ({
            ...prev,
            search: tempSearch,
        }));
    }, [tempSearch]);

    // Handle Enter key in search field
    const handleSearchKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    // Clear all filters
    const handleClearFilters = () => {
        setTempSearch("");
        setFilters({
            search: "",
            status: "",
            country: "",
            agent: "",
        });
    };

    const toggleExpandLead = (leadId) => {
        setExpandedLead(expandedLead === leadId ? null : leadId);
    };

    const handleExportLeads = async () => {
        try {
            toast.info('Preparing export...');

            const response = await exportLeadsApi(filters);

            // Check if response.data is a Blob
            if (response.data instanceof Blob) {
                // Create download link directly from the blob
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;

                // Get filename from headers
                const contentDisposition = response.headers['content-disposition'];
                let filename = `leads-${new Date().toISOString().split('T')[0]}.csv`;

                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
                    if (filenameMatch) {
                        filename = filenameMatch[1];
                    }
                }

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();

                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);

                toast.success('Leads exported successfully!');
            } else {
                // Fallback: create blob from response data
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                toast.success('Leads exported successfully!');
            }

        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export leads');
        }
    };
    return (
        <Box sx={{ display: "block", height: "100vh", bgcolor: "grey.50", position: "relative" }}>
            {/* Sidebar */}
            <Box>
                <Sidebar
                    setisMobileMenu={setisMobileMenu}
                    isMobileMenu={isMobileMenu}
                    isCollapsed={isSidebarCollapsed}
                    setIsSidebarCollapsed={setIsSidebarCollapsed}
                />
            </Box>

            {/* Overlay for mobile - closes sidebar when clicked */}
            {isMobileMenu && (
                <Box
                    onClick={() => setisMobileMenu(false)}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1199, // Below sidebar (1200) but above content
                        display: { xs: "block", md: "none" }, // Only show on mobile
                        cursor: "pointer"
                    }}
                />
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    ml: {
                        xs: 0, // for mobile (0 - 600px) 
                        md: isSidebarCollapsed ? "80px" : "280px", // from 900px+
                    },
                    transition: "margin-left 0.3s ease",
                }}
            >
                {/* Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Box 
                            sx={{ display: "flex", alignItems: "center",gap:"10px" }}>
                            <IconButton

                                onClick={() => setisMobileMenu(!isMobileMenu)}
                                size="small"
                                sx={{
                                    color: 'text.secondary', display: {
                                        xs: 'block',
                                        md: 'none'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                    Leads Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Track and manage your sales pipeline
                                </Typography>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Bulk Actions Bar - Positioned outside scrollable area for true stickiness */}
                {selectedLeads.size > 0 && (
                    <Card elevation={4} sx={{ 
                        borderRadius: 0,
                        bgcolor: 'primary.main',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1100, // Higher z-index to stay above everything
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        borderBottom: '2px solid rgba(255,255,255,0.2)',
                    }}>
                            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Badge 
                                            badgeContent={selectedLeads.size} 
                                            color="error"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.875rem',
                                                    height: 24,
                                                    minWidth: 24,
                                                    fontWeight: 'bold'
                                                }
                                            }}
                                        >
                                            <SelectAll sx={{ color: 'white', fontSize: { xs: 28, sm: 32 } }} />
                                        </Badge>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                                                {selectedLeads.size} Lead{selectedLeads.size > 1 ? 's' : ''} Selected
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: { xs: 'none', sm: 'block' } }}>
                                                Choose an action below
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        gap: 1,
                                        flexWrap: 'wrap',
                                        width: { xs: '100%', sm: 'auto' }
                                    }}>
                                    {((authUser().user.role === 'superadmin') || (authUser().user.role === 'admin' && (currentUserLatest?.adminPermissions?.canManageCrmLeads))) && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<People sx={{ display: { xs: 'none', sm: 'block' } }} />}
                                            onClick={() => setAssignDialogOpen(true)}
                                            size="small"
                                            sx={{ 
                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Assign
                                        </Button>
                                    )}
                                    {(authUser().user.role === 'superadmin' || authUser().user.role === 'admin') && (
                                        <Button
                                            variant="contained"
                                            sx={{ 
                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                                }
                                            }}
                                            startIcon={<PersonAddIcon />}
                                            onClick={() => setActivateConfirmOpen(true)}
                                            disabled={activating}
                                            size="small"
                                        >
                                            {activating ? 'Activating...' : `Activate (${selectedLeads.size})`}
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Phone />}
                                        onClick={handleBulkCall}
                                        size="small"
                                        sx={{ 
                                            flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Call Selected ({selectedLeads.size})
                                    </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Close sx={{ display: { xs: 'none', sm: 'block' } }} />}
                                            onClick={() => setSelectedLeads(new Set())}
                                            size="small"
                                            sx={{ 
                                                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                                                color: 'white',
                                                borderColor: 'rgba(255,255,255,0.5)',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    bgcolor: 'rgba(255,255,255,0.1)'
                                                }
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteSweep />}
                                            onClick={() => handleDeleteClick('bulk')}
                                            size="small"
                                            sx={{ 
                                                flex: { xs: '1 1 100%', sm: '0 0 auto' },
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Delete ({selectedLeads.size})
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                {/* Main Content Area */}
                <Box sx={{ flex: 1, overflow: "auto", p: { xs: 2, sm: 3 } }}>
                    {/* Action Bar */}
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: { xs: "flex-start", md: "center" },
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        mb: 3 
                    }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                All Leads
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Manage your leads and track conversions
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            display: "flex", 
                            gap: 1,
                            flexWrap: "wrap",
                            width: { xs: '100%', md: 'auto' }
                        }}>
                            <Button
                                variant="outlined"
                                startIcon={<Download sx={{ display: { xs: 'none', sm: 'block' } }} />}
                                onClick={handleExportLeads}
                                disabled={loading}
                                size="small"
                                sx={{ 
                                    borderRadius: 2,
                                    flex: { xs: '1 1 auto', sm: '0 0 auto' }
                                }}
                            >
                                Export
                            </Button>
                            {leads.length > 0 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete sx={{ display: { xs: 'none', sm: 'block' } }} />}
                                    size="small"
                                    sx={{ 
                                        borderRadius: 2,
                                        flex: { xs: '1 1 auto', sm: '0 0 auto' }
                                    }}
                                    onClick={() => handleDeleteClick('all')}
                                >
                                    Delete All
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                size="small"
                                sx={{ 
                                    borderRadius: 2,
                                    flex: { xs: '1 1 100%', sm: '0 0 auto' }
                                }}
                                onClick={() => setCreateDialogOpen(true)}
                            >
                                Create Lead
                            </Button>
                        </Box>
                    </Box>

                    {/* Filters Card */}
                    <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                <FilterList color="action" />
                                <Typography variant="h6" fontWeight="bold">
                                    Filters & Search
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search leads..."
                                        value={tempSearch}
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                        onKeyPress={handleSearchKeyPress}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filters.status}
                                            label="Status"
                                            onChange={(e) => handleFilterChange("status", e.target.value)}
                                        >
                                            <MenuItem value="">All Statuses</MenuItem>
                                            {STATUS_OPTIONS.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            value={filters.country}
                                            label="Country"
                                            onChange={(e) => handleFilterChange("country", e.target.value)}
                                        >
                                            <MenuItem value="">All Countries</MenuItem>
                                            {countries.map((country) => (
                                                <MenuItem key={country} value={country}>
                                                    {country}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {(authUser().user.role === 'superadmin' || (authUser().user.role === 'admin' && currentUserLatest?.adminPermissions?.canManageCrmLeads)) ? <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Agent</InputLabel>
                                        <Select
                                            value={filters.agent}
                                            label="Agent"
                                            onChange={(e) => handleFilterChange("agent", e.target.value)}
                                        >
                                            <MenuItem value="">All Agents</MenuItem>
                                            {agents.map((agent) => (
                                                <MenuItem key={agent._id} value={agent._id}>
                                                    {agent.firstName} {agent.lastName} ({agent.role}) - {agent.email}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid> : ""}
                                {/* Action Buttons Row */}
                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        display: "flex", 
                                        gap: 1, 
                                        justifyContent: "flex-start",
                                        flexWrap: "wrap"
                                    }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Search />}
                                            onClick={handleSearch}
                                            size="small"
                                            sx={{ 
                                                borderRadius: 2,
                                                minWidth: 120
                                            }}
                                        >
                                            Search
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Close />}
                                            onClick={handleClearFilters}
                                            size="small"
                                            sx={{ 
                                                borderRadius: 2,
                                                minWidth: 120
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Leads Table */}
                    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Table sx={{ minWidth: { xs: 800, md: 'auto' } }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <MuiCheckbox
                                                        indeterminate={selectedLeads.size > 0 && selectedLeads.size < leads.length}
                                                        checked={leads.length > 0 && selectedLeads.size === leads.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                </TableCell>
                                                <TableCell />
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 200 }}>
                                                    Contact
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 130 }}>
                                                    Phone
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 120 }}>
                                                    Country
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 120 }}>
                                                    Brand
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 150 }}>
                                                    Agent
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 120 }}>
                                                    Status
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 120 }}>
                                                    Created
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: "bold", color: "text.secondary", minWidth: 90 }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {leads.map((lead) => (
                                                <React.Fragment key={lead._id}>
                                                    <TableRow hover>
                                                        <TableCell padding="checkbox">
                                                            <MuiCheckbox
                                                                checked={selectedLeads.has(lead._id)}
                                                                onChange={() => handleSelectLead(lead._id)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleExpandLead(lead._id)}
                                                            >
                                                                {expandedLead === lead._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box>
                                                                <Typography 
                                                                    variant="body2" 
                                                                    fontWeight="bold"
                                                                    onClick={() => navigate(`/admin/crm/lead/${lead._id}/stream`)}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        color: 'primary.main',
                                                                        '&:hover': {
                                                                            textDecoration: 'underline'
                                                                        }
                                                                    }}
                                                                >
                                                                    {lead.firstName} {lead.lastName}
                                                                </Typography>
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                                                    <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                                                                    <Typography 
                                                                        component="a"
                                                                        href={`mailto:${lead.email}`}
                                                                        variant="caption" 
                                                                        sx={{
                                                                            color: "primary.main",
                                                                            textDecoration: "none",
                                                                            cursor: "pointer",
                                                                            "&:hover": {
                                                                                textDecoration: "underline"
                                                                            }
                                                                        }}
                                                                    >
                                                                        {lead.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                                                                <Typography 
                                                                    component="a"
                                                                    href={`tel:${lead.phone}`}
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: "primary.main",
                                                                        textDecoration: "none",
                                                                        cursor: "pointer",
                                                                        "&:hover": {
                                                                            textDecoration: "underline"
                                                                        }
                                                                    }}
                                                                >
                                                                    {lead.phone}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{lead.country}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {lead.Brand}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {lead.agent ? `${lead.agent.firstName} ${lead.agent.lastName} (${lead.agent.role})` : 'Unassigned'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{getStatusChip(lead.status)}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatDate(lead.createdAt)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                {lead.phone && (
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() => handleCallLead(lead)}
                                                                        disabled={callStatuses[lead._id] === 'ringing' || callStatuses[lead._id] === 'in-progress'}
                                                                        title="Call Lead"
                                                                    >
                                                                        <Phone />
                                                                    </IconButton>
                                                                )}
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => handleMenuOpen(e, lead)}
                                                                >
                                                                    <MoreVert />
                                                                </IconButton>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                                                            <Collapse in={expandedLead === lead._id} timeout="auto" unmountOnExit>
                                                                <Box sx={{ margin: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} sm={6} md={3}>
                                                                            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                                                            <Typography 
                                                                                component="a"
                                                                                href={`mailto:${lead.email}`}
                                                                                variant="body2"
                                                                                sx={{
                                                                                    color: "primary.main",
                                                                                    textDecoration: "none",
                                                                                    cursor: "pointer",
                                                                                    "&:hover": {
                                                                                        textDecoration: "underline"
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {lead.email}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6} md={3}>
                                                                            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                                                            <Typography 
                                                                                component="a"
                                                                                href={`tel:${lead.phone}`}
                                                                                variant="body2"
                                                                                sx={{
                                                                                    color: lead.phone ? "primary.main" : "text.secondary",
                                                                                    textDecoration: "none",
                                                                                    cursor: lead.phone ? "pointer" : "default",
                                                                                    "&:hover": {
                                                                                        textDecoration: lead.phone ? "underline" : "none"
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {lead.phone || 'Not provided'}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6} md={3}>
                                                                            <Typography variant="subtitle2" color="text.secondary">Country</Typography>
                                                                            <Typography variant="body2">{lead.country || 'Not provided'}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6} md={3}>
                                                                            <Typography variant="subtitle2" color="text.secondary">Brand</Typography>
                                                                            <Typography variant="body2">{lead.Brand || 'Not provided'}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                                                            <Typography variant="body2">{lead.Address || 'Not provided'}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Box sx={{ 
                                                                                display: 'flex', 
                                                                                gap: 1,
                                                                                flexWrap: 'wrap'
                                                                            }}>
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    startIcon={<Visibility />}
                                                                                    onClick={() => {
                                                                                        setSelectedLead(lead);
                                                                                        setViewDetailsOpen(true);
                                                                                    }}
                                                                                    sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                                                                                >
                                                                                    View
                                                                                </Button>
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    startIcon={<Edit />}
                                                                                    onClick={() => {
                                                                                        setSelectedLead(lead);
                                                                                        setEditDialogOpen(true);
                                                                                    }}
                                                                                    sx={{ flex: { xs: '1 1 48%', sm: '0 0 auto' } }}
                                                                                >
                                                                                    Edit
                                                                                </Button>
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    color="error"
                                                                                    startIcon={<Delete />}
                                                                                    onClick={() => handleDeleteClick('single', lead)}
                                                                                    sx={{ flex: { xs: '1 1 48%', sm: '0 0 auto' } }}
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                            {leads.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                                                        <Search sx={{ fontSize: 48, color: "grey.300", mb: 2 }} />
                                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                                            No leads found
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            Try adjusting your filters or create a new lead
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<Add />}
                                                            onClick={() => setCreateDialogOpen(true)}
                                                        >
                                                            Create Your First Lead
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Enhanced Pagination */}
                                    {leads.length > 0 && (
                                        <Box sx={{ p: { xs: 1, sm: 2 }, borderTop: 1, borderColor: 'divider' }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                flexWrap: 'wrap', 
                                                gap: 2 
                                            }}>
                                                {/* Page Size Selector */}
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    order: { xs: 2, md: 1 }
                                                }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                                        Rows:
                                                    </Typography>
                                                    <Select
                                                        size="small"
                                                        value={pagination.limit}
                                                        onChange={handleLimitChange}
                                                        sx={{ minWidth: 70 }}
                                                    >
                                                        <MenuItem value={50}>50</MenuItem>
                                                        <MenuItem value={100}>100</MenuItem>
                                                        <MenuItem value={150}>150</MenuItem>
                                                        <MenuItem value={200}>200</MenuItem>
                                                    </Select>
                                                </Box>

                                                {/* Pagination Info */}
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        order: { xs: 3, md: 2 },
                                                        width: { xs: '100%', md: 'auto' },
                                                        textAlign: { xs: 'center', md: 'left' },
                                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                    }}
                                                >
                                                    {((pagination.currentPage - 1) * pagination.limit) + 1}-
                                                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalFiltered)} of{' '}
                                                    {pagination.totalFiltered}
                                                    {pagination.totalFiltered !== pagination.totalLeads && (
                                                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                                                            {' '}(filtered from {pagination.totalLeads})
                                                        </Box>
                                                    )}
                                                </Typography>

                                                {/* Pagination Controls */}
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 0.5,
                                                    order: { xs: 1, md: 3 }
                                                }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handlePrevPage}
                                                        disabled={!pagination.hasPrevPage}
                                                        sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                                                    >
                                                        <NavigateBefore />
                                                    </IconButton>
                                                    <Button
                                                        size="small"
                                                        onClick={handlePrevPage}
                                                        disabled={!pagination.hasPrevPage}
                                                        startIcon={<NavigateBefore />}
                                                        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                                                    >
                                                        Prev
                                                    </Button>

                                                    <Pagination
                                                        count={pagination.totalPages}
                                                        page={pagination.currentPage}
                                                        onChange={handlePageChange}
                                                        color="primary"
                                                        size="small"
                                                        showFirstButton={false}
                                                        showLastButton={false}
                                                        siblingCount={0}
                                                        boundaryCount={1}
                                                        sx={{
                                                            '& .MuiPagination-ul': {
                                                                flexWrap: 'nowrap'
                                                            }
                                                        }}
                                                    />

                                                    <Button
                                                        size="small"
                                                        onClick={handleNextPage}
                                                        disabled={!pagination.hasNextPage}
                                                        endIcon={<NavigateNext />}
                                                        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                                                    >
                                                        Next
                                                    </Button>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleNextPage}
                                                        disabled={!pagination.hasNextPage}
                                                        sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                                                    >
                                                        <NavigateNext />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}
                        </TableContainer>
                    </Card>
                </Box>
            </Box>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: 2, minWidth: 160 },
                }}
            >
                <MenuItem onClick={handleViewDetails}>
                    <Visibility sx={{ mr: 1, fontSize: 20 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleEditLead}>
                    <Edit sx={{ mr: 1, fontSize: 20 }} />
                    Edit Lead
                </MenuItem>
                {(authUser()?.user?.role === 'superadmin' || authUser()?.user?.role === 'admin') && (
                    <MenuItem onClick={handleActivateLead} sx={{ color: "success.main" }}>
                        <PersonAddIcon sx={{ mr: 1, fontSize: 20 }} />
                        Activate User
                    </MenuItem>
                )}
                <MenuItem onClick={handleDeleteLead} sx={{ color: "error.main" }}>
                    <Delete sx={{ mr: 1, fontSize: 20 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Create Lead Dialog */}
            <CreateLeadDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onLeadCreated={handleLeadCreated}
                agents={agents}
                currentUser={currentAuthUser}
                allowCsvUpload={currentUserLatest?.role === 'superadmin' || (currentUserLatest?.role === 'admin' && currentUserLatest?.adminPermissions?.canManageCrmLeads)}
            />

            {/* View Details Dialog */}
            <LeadDetails
                lead={selectedLead}
                open={viewDetailsOpen}
                onClose={() => setViewDetailsOpen(false)}
                navigate={navigate}
            />

            {/* Edit Lead Dialog */}
            <EditLeadDialog
                lead={selectedLead}
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onLeadUpdated={handleLeadUpdated}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteConfirmOpen} 
                onClose={() => !deleteProgress.isProcessing && setDeleteConfirmOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Delete color="error" />
                        <Typography variant="h6">Confirm Delete</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                    {!deleteProgress.isProcessing ? (
                        <>
                            <Typography>
                                {deleteType === 'single' && `Are you sure you want to delete ${selectedLead?.firstName} ${selectedLead?.lastName}?`}
                                {deleteType === 'bulk' && `Are you sure you want to delete ${selectedLeads.size} selected leads?`}
                                {deleteType === 'all' && (
                                    <>
                                        <Typography variant="body1" gutterBottom>
                                            Are you sure you want to delete <strong>ALL {pagination.totalFiltered} leads</strong>?
                                        </Typography>
                                        <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                                            ⚠️ This action will move all leads to the recycle bin.
                                        </Typography>
                                    </>
                                )}
                            </Typography>
                            {deleteType !== 'all' && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    This will move the lead(s) to the recycle bin.
                                </Typography>
                            )}
                        </>
                    ) : (
                        <Box sx={{ width: '100%', py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {deleteProgress.msg}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="error.main">
                                    {deleteProgress.percentage}%
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={deleteProgress.percentage} 
                                color="error"
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Deleted {deleteProgress.deleted.toLocaleString()} of {deleteProgress.total.toLocaleString()} leads
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deleteProgress.isProcessing}>
                        {deleteProgress.isProcessing ? 'Processing...' : 'Cancel'}
                    </Button>
                    {!deleteProgress.isProcessing && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
                        >
                            {deleting ? 'Starting...' : 'Delete'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Activation Confirmation Dialog */}
            <Dialog
                open={activateConfirmOpen}
                onClose={() => !activating && setActivateConfirmOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonAddIcon color="primary" />
                        <Typography variant="h6">Confirm Activation</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You are about to activate <strong>{selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''}</strong> to users.
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>This will:</strong>
                        </Typography>
                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                            <li>Create user accounts for each lead (fast - ~30 seconds)</li>
                            <li>Generate random passwords</li>
                            {sendWelcomeEmail && <li>Queue welcome emails for background sending</li>}
                        </ul>
                    </Alert>

                    {/* Email Option Toggle */}
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2, 
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 2 
                    }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sendWelcomeEmail}
                                    onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                        📧 Send Welcome Emails
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {sendWelcomeEmail 
                                            ? 'Welcome emails with login credentials will be sent to all activated users'
                                            : 'Users will be created without sending welcome emails'}
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>

                    {!sendWelcomeEmail && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                📥 CSV Download
                            </Typography>
                            <Typography variant="caption">
                                A CSV file containing email addresses and passwords will be automatically downloaded after user creation. 
                                You can use this file to share credentials with users manually.
                            </Typography>
                        </Alert>
                    )}

                    <Typography variant="body2" color="text.secondary">
                        ℹ️ User creation is fast! {sendWelcomeEmail && 'After completion, emails will be sent in the background automatically.'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setActivateConfirmOpen(false)} 
                        disabled={activating}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleBulkActivate} 
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            }
                        }}
                        startIcon={activating ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                        disabled={activating}
                    >
                        {activating ? 'Activating...' : `Activate ${selectedLeads.size} Lead${selectedLeads.size !== 1 ? 's' : ''}`}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign Leads Dialog */}
            <Dialog 
                open={assignDialogOpen} 
                onClose={() => setAssignDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Assign Selected Leads</DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                    <Typography sx={{ mb: 2 }}>Select an agent to assign {selectedLeads.size} lead(s):</Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel>Agent</InputLabel>
                        <Select
                            value={selectedAgentId}
                            label="Agent"
                            onChange={(e) => setSelectedAgentId(e.target.value)}
                        >
                            {agents
                                .filter(a => a.role === 'admin' || a.role === 'subadmin' || a.role === 'superadmin')
                                .map(agent => (
                                    <MenuItem key={agent._id} value={agent._id}>
                                        {agent.firstName} {agent.lastName} ({agent.role}) - {agent.email}{currentAuthUser?.user?._id === agent._id ? ' (self)' : ''}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            try {
                                if (!selectedAgentId) {
                                    toast.error('Please select an agent');
                                    return;
                                }
                                setAssigning(true);
                                const res = await assignLeadsApi(Array.from(selectedLeads), selectedAgentId);
                                if (res.success) {
                                    toast.success(res.msg || 'Leads assigned successfully');
                                    // Fetch leads first before closing modal
                                    await fetchLeads(pagination.currentPage);
                                    // Reset state before closing
                                    setSelectedAgentId("");
                                    setSelectedLeads(new Set());
                                    setAssigning(false);
                                    // Close modal last
                                    setAssignDialogOpen(false);
                                } else {
                                    toast.error(res.msg || 'Failed to assign leads');
                                    setAssigning(false);
                                }
                            } catch (err) {
                                console.error('Assign error:', err);
                                toast.error('Error assigning leads');
                                setAssigning(false);
                            }
                        }}
                        disabled={assigning || selectedLeads.size === 0}
                    >
                        {assigning ? <CircularProgress size={24} /> : 'Assign'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Blocking Activation Modal */}
            <Dialog
                open={activationModalOpen}
                onClose={() => {}} // Can't close while processing
                disableEscapeKeyDown
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonAddIcon color="primary" />
                        <Typography variant="h6">Creating User Accounts</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {activationProgress.msg}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    Progress
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="primary">
                                    {activationProgress.percentage}%
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={activationProgress.percentage} 
                                sx={{ 
                                    height: 10, 
                                    borderRadius: 5,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    }
                                }}
                            />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f1f8e9', borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight="bold" color="#558b2f">
                                        {activationProgress.activated}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Created
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#fff3e0', borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight="bold" color="#e65100">
                                        {activationProgress.skipped}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Skipped
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#ffebee', borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight="bold" color="#c62828">
                                        {activationProgress.failed}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Failed
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="caption">
                                ⏳ Please wait... This usually takes 10-30 seconds for 100 leads.
                            </Typography>
                        </Alert>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default LeadsPage;