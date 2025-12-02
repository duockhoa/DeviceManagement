import { useState, useRef } from 'react';
import { Box, Typography, IconButton, Paper, Stack, LinearProgress, Alert } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

function InputFile({ 
    fieldName, 
    label, 
    accept = '*/*', 
    multiple = true, 
    maxSize = 100,
    value = [],
    onChange,
    error: externalError,
    placeholder = 'Thêm files'
}) {
    const fileInputRef = useRef();
    const [uploadProgress, setUploadProgress] = useState({});
    const [internalError, setInternalError] = useState('');

    // Sử dụng value từ props hoặc state nội bộ
    const currentFiles = value || [];
    const error = externalError || internalError;

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setInternalError('');

        // Validate file size (MB)
        const invalidFiles = selectedFiles.filter((file) => file.size > maxSize * 1024 * 1024);
        if (invalidFiles.length > 0) {
            setInternalError(`File không được vượt quá ${maxSize}MB`);
            return;
        }

        // Process files
        const processedFiles = selectedFiles.map((file) => ({
            id: Date.now() + Math.random(),
            file: file,
            file_group: fieldName,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file), // For preview
            uploadStatus: 'pending',
        }));

        // Update files list
        const updatedFiles = multiple ? [...currentFiles, ...processedFiles] : processedFiles;

        // Call onChange callback if provided
        if (onChange) {
            onChange(updatedFiles, fieldName);
        }

        // Reset input
        event.target.value = '';
    };

    const handleRemoveFile = (fileId) => {
        const updatedFiles = currentFiles.filter((file) => file.id !== fileId);
        
        // Cleanup object URL to prevent memory leaks
        const fileToRemove = currentFiles.find(file => file.id === fileId);
        if (fileToRemove && fileToRemove.url && fileToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.url);
        }

        // Call onChange callback if provided
        if (onChange) {
            onChange(updatedFiles, fieldName);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return '🖼️';
        } else if (fileType.includes('pdf')) {
            return '📄';
        } else if (fileType.includes('word')) {
            return '📝';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return '📊';
        } else if (fileType.includes('zip') || fileType.includes('rar')) {
            return '🗜️';
        }
        return '📎';
    };

    // Cleanup URLs when component unmounts
    useState(() => {
        return () => {
            currentFiles.forEach(file => {
                if (file.url && file.url.startsWith('blob:')) {
                    URL.revokeObjectURL(file.url);
                }
            });
        };
    }, []);

    return (
        <Stack spacing={2}>
            {/* Upload Button */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ minWidth: 120, fontSize: '1.4rem' }}>
                    {label}:
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: 'grey.50',
                            borderColor: 'primary.main',
                        },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple={multiple}
                        accept={accept}
                        style={{ display: 'none' }}
                    />
                    <IconButton
                        size="small"
                        sx={{
                            mx: 1,
                            transform: 'rotate(45deg)',
                            color: 'primary.main',
                        }}
                    >
                        <AttachFileIcon />
                    </IconButton>
                    <Typography sx={{ fontSize: '1.4rem', color: 'grey.600' }}>
                        {multiple ? placeholder : placeholder.replace('files', 'file')}
                    </Typography>
                </Box>
            </Stack>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ ml: 15 }}>
                    {error}
                </Alert>
            )}

            {/* Files Preview */}
            {currentFiles.length > 0 && (
                <Stack spacing={1} sx={{ ml: 15 }}>
                    <Typography variant="body2" color="text.secondary">
                        {currentFiles.length} file{currentFiles.length > 1 ? 's' : ''} đã chọn
                    </Typography>
                    
                    {currentFiles.map((fileItem) => (
                        <Paper
                            key={fileItem.id}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                                border: '1px solid',
                                borderColor: 'grey.200',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                    borderColor: 'grey.300',
                                },
                            }}
                        >
                            {/* File Icon */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    mr: 2,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {fileItem.type.startsWith('image/') ? (
                                    <img
                                        src={fileItem.url}
                                        alt={fileItem.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : (
                                    <TextSnippetIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                )}
                            </Box>

                            {/* File Info */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '1.1rem',
                                        color: 'text.primary',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    title={fileItem.name}
                                >
                                    {fileItem.name}
                                </Typography>
                                
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {formatFileSize(fileItem.size)}
                                    </Typography>
                                    
                                    {fileItem.type && (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            • {fileItem.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                        </Typography>
                                    )}
                                </Stack>

                                {/* Upload Progress */}
                                {uploadProgress[fileItem.id] && (
                                    <Box sx={{ mt: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={uploadProgress[fileItem.id]}
                                            sx={{ height: 4, borderRadius: 2 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {uploadProgress[fileItem.id]}% uploaded
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Remove Button */}
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveFile(fileItem.id)}
                                sx={{ 
                                    ml: 2,
                                    '&:hover': {
                                        bgcolor: 'error.light',
                                        color: 'error.contrastText',
                                    },
                                }}
                                title="Xóa file"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Stack>
            )}

            {/* File count and size summary */}
            {currentFiles.length > 0 && (
                <Box sx={{ ml: 15 }}>
                    <Typography variant="caption" color="text.secondary">
                        Tổng dung lượng: {formatFileSize(currentFiles.reduce((total, file) => total + file.size, 0))}
                        {maxSize && ` / ${maxSize}MB tối đa`}
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}

export default InputFile;
