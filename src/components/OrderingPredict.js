// OrderingPredict.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './ordering.css';

const baseUrl = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:5000" 
  : "https://api.morgotools.com";

const OrderingPredict = () => {
  const [file, setFile] = useState(null);
  const [numDays, setNumDays] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState({});

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(acceptedFiles[0]);
      setError('');
    } else {
      setError('Please upload a valid .xlsx file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx',
    multiple: false
  });

  const handleProcess = async () => {
    if (!file || !numDays) {
      setError('Please upload a file and enter valid days');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('numOfDays', numDays);

    try {
      const response = await axios.post(`${baseUrl}/process-order`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
      setSelectedItems({});
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Processing failed');
      setResults(null);
    }
  };

  const getVariantClass = (days) => {
    if (days <= 3) return 'list-group-item-danger';
    if (days <= 7) return 'list-group-item-warning';
    return '';
  };

  const handleSelectAll = (vendor) => {
    setSelectedItems(prevSelected => {
      const currentVendorItems = results[vendor];
      const currentSelected = prevSelected[vendor] || [];
      const allSelected = currentSelected.length === currentVendorItems.length;
      
      return {
        ...prevSelected,
        [vendor]: allSelected ? [] : currentVendorItems.map((_, index) => index)
      };
    });
  };

  const handleCheckboxChange = (vendor, index) => {
    setSelectedItems(prevSelected => {
      const vendorSelected = prevSelected[vendor] || [];
      if (vendorSelected.includes(index)) {
        return {
          ...prevSelected,
          [vendor]: vendorSelected.filter(i => i !== index)
        };
      }
      return {
        ...prevSelected,
        [vendor]: [...vendorSelected, index]
      };
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Drag report by Serial Number</h1>
      <div 
        {...getRootProps({ className: "dropzone" })}
        className={`border-dashed p-4 text-center mb-3 ${isDragActive ? 'bg-light' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <p>Drag & drop an .xlsx file, or click to select</p>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {file && (
        <div className="mb-3" style={{ textAlign: 'center' }}>
        <label className="form-label" style={{ display: 'inline-block' }}>
            How many days in the report?
            <input
              type="number"
              className="form-control mt-1"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
              min="1"
              max="999"
              placeholder="7-14 typical"
            />
          </label>
        </div>
      )}

      {file && numDays && (
        <div style={{ textAlign: 'center' }}>
        <button 
            className="btn btn-primary mb-4"
            onClick={handleProcess}
        >
            Process Report
        </button>
        </div>
      )}

      {results && Object.entries(results).map(([vendor, items]) => (
        <div key={vendor} className="mb-4">
          <h3 className="h5 mb-2">{vendor}</h3>
          <div className="ms-auto" style={{paddingBottom: "10px"}}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm me-2"
              onClick={() => handleSelectAll(vendor)}
            >
              {selectedItems[vendor]?.length === items.length ? 'Unselect All' : 'Select All'}
            </button>
            <button type="button" className="btn btn-secondary btn-sm me-2">Notify Verdant</button>
            <button type="button" className="btn btn-secondary btn-sm">Notify Provider</button>
          </div>
          <div className="list-group">
            {items.map((item, index) => (
              <label
                key={index}
                className={`list-group-item d-flex align-items-center ${getVariantClass(item.daysUntilSoldOut)}`}
              >
                <input 
                  type="checkbox" 
                  className="form-check-input me-3" 
                  checked={selectedItems[vendor]?.includes(index) || false}
                  onChange={() => handleCheckboxChange(vendor, index)}
                />
                <div>
                  {item.name}
                  <small className="text-muted d-block">
                    {item.daysUntilSoldOut} days remaining
                  </small>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderingPredict;
