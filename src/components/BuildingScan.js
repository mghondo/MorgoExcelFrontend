import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './ordering.css';

const baseUrl = window.location.hostname === "localhost" ? "http://127.0.0.1:5000" : "https://api.morgotools.com";

const BuildingScan = () => {
  const [file, setFile] = useState(null);
  const [scanResults, setScanResults] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]?.type === 'application/pdf') {
      setFile(acceptedFiles[0]);
      setError('');
    } else {
      setError('Please upload a valid PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: false
  });

  const handleScan = async () => {
    if (!file) {
      setError('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${baseUrl}/scan-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setScanResults(response.data.results);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Scanning failed');
      setScanResults(null);
    }
  };

  return (
    <div className="container">
      <h1>Building Scan</h1>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF file here...</p>
        ) : (
          <p>Drag & drop a PDF file here, or click to select one</p>
        )}
      </div>
      {file && <p>Selected file: {file.name}</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={handleScan} className="scan-button">Scan PDF</button>
      {scanResults && (
        <div className="scan-results">
          <h2>Scan Results</h2>
          {scanResults.outbound_transporter && (
            <p><strong>Outbound Transporter:</strong> {scanResults.outbound_transporter}</p>
          )}
          {/* Display other scan results */}
          <pre>{JSON.stringify(scanResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BuildingScan;
