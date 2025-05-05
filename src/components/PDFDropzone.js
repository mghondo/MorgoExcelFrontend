import React from 'react';
import { useDropzone } from 'react-dropzone';
import './PDFDropzone.css';

const PDFDropzone = ({ file, setFile, setError, loading }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      if (acceptedFiles[0]?.type === 'application/pdf') {
        setFile(acceptedFiles[0]);
        setError('');
      } else {
        setError('Please upload a valid PDF file');
      }
    },
    accept: 'application/pdf',
    multiple: false
  });

  return (
    <div {...getRootProps()} className={`dropzone p-4 mb-3 border rounded ${loading ? 'loading' : ''}`}>
      <input {...getInputProps()} />
      {loading ? (
        <div className="loading-container">
          <p>Loading</p>
          <div className="spinner"></div>
        </div>
      ) : isDragActive ? (
        <p>Drop PDF</p>
      ) : file ? (
        <p>Ready to scan: {file.name}</p>
      ) : (
        <p>Drag & drop PDF, or click to select</p>
      )}
    </div>
  );
};

export default PDFDropzone;