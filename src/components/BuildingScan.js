import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Form, Button, Row, Col, InputGroup, Dropdown } from 'react-bootstrap';
import PDFDropzone from './PDFDropzone';
import ExpirationDatePicker from './ExpirationDatePicker';
import './ordering.css';
import './BuildingScan.css';

const baseUrl = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:5000" 
  : "https://api.morgotools.com";

const BuildingScan = () => {
  const [file, setFile] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [subType, setSubType] = useState(''); // State for radio button selection
  const [company, setCompany] = useState(''); // State for editable company
  const [drivers, setDrivers] = useState(''); // State for editable drivers
  const [additionalFields, setAdditionalFields] = useState({
    thc: '',
    thcUnit: '%',
    cbd: '',
    cbdUnit: '%',
    expirationDate: ''
  });
  const [buttonStates, setButtonStates] = useState({
    name: { variant: 'primary', text: 'Copy' },
    package_id: { variant: 'primary', text: 'Copy' },
    m_number: { variant: 'primary', text: 'Copy' },
    type: { variant: 'primary', text: 'Copy' },
    strain: { variant: 'primary', text: 'Copy' },
    days: { variant: 'primary', text: 'Copy' },
    weight: { variant: 'primary', text: 'Copy' },
    company: { variant: 'primary', text: 'Copy' },
    drivers: { variant: 'primary', text: 'Copy' },
    thc: { variant: 'primary', text: 'Copy' },
    cbd: { variant: 'primary', text: 'Copy' },
    expirationDate: { variant: 'primary', text: 'Copy' }
  });

  const handleScan = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${baseUrl}/api/scan-pdf`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setScanData(response.data);
      setActivePage(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  // Initialize editedItem, subType, company, and drivers when scanData or activePage changes
  useEffect(() => {
    if (scanData) {
      setCompany(scanData.company || '');
      setDrivers(scanData.drivers || '');
    }
    if (scanData && scanData.items && scanData.items[activePage]) {
      setEditedItem({
        name: scanData.items[activePage].name || '',
        package_id: scanData.items[activePage].package_id || '',
        m_number: scanData.items[activePage].m_number || '',
        type: scanData.items[activePage].type || '',
        strain: scanData.items[activePage].strain || '',
        days: scanData.items[activePage].days || '',
        weight: scanData.items[activePage].weight || ''
      });

      // Set default subType based on Type
      const type = scanData.items[activePage].type || '';
      if (type === 'Flower') {
        setSubType('Ground'); // Default for Flower
      } else if (type === 'Edible') {
        setSubType('Gummies'); // Default for Edible
      } else {
        setSubType(''); // Clear subType if Type is neither Flower nor Edible
      }
    }
  }, [scanData, activePage]);

  const handleInputChange = (field, value) => {
    setEditedItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalFieldChange = (field, value) => {
    setAdditionalFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = (field, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setButtonStates(prev => ({
          ...prev,
          [field]: { variant: 'info', text: 'Copied' }
        }));
        setTimeout(() => {
          setButtonStates(prev => ({
            ...prev,
            [field]: { variant: 'primary', text: 'Copy' }
          }));
        }, 5000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setButtonStates(prev => ({
          ...prev,
          [field]: { variant: 'info', text: 'Copied' }
        }));
        setTimeout(() => {
          setButtonStates(prev => ({
            ...prev,
            [field]: { variant: 'primary', text: 'Copy' }
          }));
        }, 5000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="container mt-4">
      <PDFDropzone 
        file={file} 
        setFile={setFile} 
        setError={setError} 
        loading={loading}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-center mb-4">
        <button 
          onClick={handleScan}
          className="btn btn-primary"
          disabled={!file || loading}
        >
          Scan PDF
        </button>
      </div>

      {scanData && (
        <div className="scan-results">
          <div className="mb-4">
            <Row className="align-items-center mb-2">
              <Col xs={1}>
                <Button 
                  variant={buttonStates.company.variant} 
                  size="sm" 
                  onClick={() => copyToClipboard('company', company || '')}
                >
                  {buttonStates.company.text}
                </Button>
              </Col>
              <Col xs={1}>
                <Form.Label>Company:</Form.Label>
              </Col>
              <Col xs={10}>
                <Form.Control 
                  type="text" 
                  value={company} 
                  placeholder="Enter Company"
                  onChange={(e) => setCompany(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col xs={1}>
                <Button 
                  variant={buttonStates.drivers.variant} 
                  size="sm" 
                  onClick={() => copyToClipboard('drivers', drivers || '')}
                >
                  {buttonStates.drivers.text}
                </Button>
              </Col>
              <Col xs={1}>
                <Form.Label>Drivers:</Form.Label>
              </Col>
              <Col xs={10}>
                <Form.Control 
                  type="text" 
                  value={drivers} 
                  placeholder="Enter Drivers"
                  onChange={(e) => setDrivers(e.target.value)}
                />
              </Col>
            </Row>
          </div>

          {/* Product Display */}
          <div className="product-card p-3 mb-3 border rounded">
            <h4>{activePage + 1}.)</h4>
            <Row>
              {/* Left Column: Existing Inputs */}
              <Col md={6}>
                <Row className="mb-2 d-flex align-items-start">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.name.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('name', editedItem.name || '')}
                    >
                      {buttonStates.name.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Product Name:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      value={editedItem.name || ''} 
                      placeholder="Enter Product Name"
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.package_id.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('package_id', editedItem.package_id || '')}
                    >
                      {buttonStates.package_id.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Package ID:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      type="text" 
                      value={editedItem.package_id || ''} 
                      placeholder="Enter Package ID"
                      onChange={(e) => handleInputChange('package_id', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.m_number.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('m_number', editedItem.m_number || '')}
                    >
                      {buttonStates.m_number.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>M Number:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      type="text" 
                      value={editedItem.m_number || ''} 
                      placeholder="Enter M Number"
                      onChange={(e) => handleInputChange('m_number', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.type.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('type', editedItem.type || '')}
                    >
                      {buttonStates.type.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Type:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      type="text" 
                      value={editedItem.type || ''} 
                      placeholder="Enter Type"
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    />
                  </Col>
                </Row>
                {editedItem.type === 'Flower' && (
                  <Row className="mb-2 d-flex align-items-center">
                    <Col xs={2}></Col>
                    <Col xs={3}>
                      <Form.Label>Sub-Type:</Form.Label>
                    </Col>
                    <Col xs={7}>
                      <Form.Check
                        inline
                        label="Ground"
                        name="subType"
                        type="radio"
                        id="ground"
                        checked={subType === 'Ground'}
                        onChange={() => setSubType('Ground')}
                      />
                      <Form.Check
                        inline
                        label="Mids"
                        name="subType"
                        type="radio"
                        id="mids"
                        checked={subType === 'Mids'}
                        onChange={() => setSubType('Mids')}
                      />
                      <Form.Check
                        inline
                        label="Full Flower"
                        name="subType"
                        type="radio"
                        id="fullFlower"
                        checked={subType === 'Full Flower'}
                        onChange={() => setSubType('Full Flower')}
                      />
                    </Col>
                  </Row>
                )}
                {editedItem.type === 'Edible' && (
                  <Row className="mb-2 d-flex align-items-center">
                    <Col xs={2}></Col>
                    <Col xs={3}>
                      <Form.Label>Sub-Type:</Form.Label>
                    </Col>
                    <Col xs={7}>
                      <Form.Check
                        inline
                        label="Gummies"
                        name="subType"
                        type="radio"
                        id="gummies"
                        checked={subType === 'Gummies'}
                        onChange={() => setSubType('Gummies')}
                      />
                      <Form.Check
                        inline
                        label="Drinks"
                        name="subType"
                        type="radio"
                        id="drinks"
                        checked={subType === 'Drinks'}
                        onChange={() => setSubType('Drinks')}
                      />
                      <Form.Check
                        inline
                        label="Chocolate"
                        name="subType"
                        type="radio"
                        id="chocolate"
                        checked={subType === 'Chocolate'}
                        onChange={() => setSubType('Chocolate')}
                      />
                      <Form.Check
                        inline
                        label="Syrup"
                        name="subType"
                        type="radio"
                        id="syrup"
                        checked={subType === 'Syrup'}
                        onChange={() => setSubType('Syrup')}
                      />
                    </Col>
                  </Row>
                )}
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.strain.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('strain', editedItem.strain || '')}
                    >
                      {buttonStates.strain.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Strain:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      type="text" 
                      value={editedItem.strain || ''} 
                      placeholder="Enter Strain"
                      onChange={(e) => handleInputChange('strain', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.days.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('days', editedItem.days || '')}
                    >
                      {buttonStates.days.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Days Supply:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      type="text" 
                      value={editedItem.days || ''} 
                      placeholder="Enter Days Supply"
                      onChange={(e) => handleInputChange('days', e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.weight.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('weight', editedItem.weight || '')}
                    >
                      {buttonStates.weight.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Weight:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <Form.Control 
                      type="text" 
                      value={editedItem.weight || ''} 
                      placeholder="Enter Weight"
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>

              {/* Right Column: New Inputs with Copy Buttons and Unit Dropdowns */}
              <Col md={6}>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.thc.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('thc', additionalFields.thc || '')}
                    >
                      {buttonStates.thc.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>THC:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <InputGroup className="custom-input-group">
                      <Form.Control 
                        type="text" 
                        value={additionalFields.thc} 
                        id="thc"
                        placeholder="Enter THC"
                        onChange={(e) => handleAdditionalFieldChange('thc', e.target.value)}
                      />
                      <Dropdown>
                        <Dropdown.Toggle
                          id="thcdrop"
                          className="custom-dropdown-toggle"
                        >
                          {additionalFields.thcUnit}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleAdditionalFieldChange('thcUnit', '%')}>
                            %
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAdditionalFieldChange('thcUnit', 'mg')}>
                            mg
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.cbd.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('cbd', additionalFields.cbd || '')}
                    >
                      {buttonStates.cbd.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>CBD:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <InputGroup className="custom-input-group">
                      <Form.Control 
                        type="text" 
                        value={additionalFields.cbd} 
                        id="cbd"
                        placeholder="Enter CBD"
                        onChange={(e) => handleAdditionalFieldChange('cbd', e.target.value)}
                      />
                      <Dropdown>
                        <Dropdown.Toggle
                          id="cbddrop"
                          className="custom-dropdown-toggle"
                        >
                          {additionalFields.cbdUnit}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleAdditionalFieldChange('cbdUnit', '%')}>
                            %
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAdditionalFieldChange('cbdUnit', 'mg')}>
                            mg
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="mb-2 d-flex align-items-center">
                  <Col xs={2}>
                    <Button 
                      variant={buttonStates.expirationDate.variant} 
                      size="sm" 
                      onClick={() => copyToClipboard('expirationDate', additionalFields.expirationDate || '')}
                    >
                      {buttonStates.expirationDate.text}
                    </Button>
                  </Col>
                  <Col xs={3}>
                    <Form.Label>Expiration Date:</Form.Label>
                  </Col>
                  <Col xs={7}>
                    <ExpirationDatePicker
                      value={additionalFields.expirationDate}
                      onChange={(value) => handleAdditionalFieldChange('expirationDate', value)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* Item Details Row with Heading */}
            <Row>
              <Col xs={12}>
                <h5 className="text-center mb-2">Item Details</h5>
                <div className="border rounded p-3" style={{ backgroundColor: '#e0e7e0' }}>
                  <p className="mb-0">{scanData.items[activePage].Item_Details}</p>
                </div>
              </Col>
            </Row>
          </div>

          {/* Pagination */}
          <Pagination className="justify-content-center">
            <Pagination.Prev 
              onClick={() => setActivePage(p => Math.max(0, p - 1))}
              disabled={activePage === 0}
            />
            
            {scanData.items.map((_, index) => (
              <Pagination.Item
                key={index}
                active={index === activePage}
                onClick={() => setActivePage(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            
            <Pagination.Next
              onClick={() => setActivePage(p => Math.min(scanData.items.length - 1, p + 1))}
              disabled={activePage === scanData.items.length - 1}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BuildingScan;