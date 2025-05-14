import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

const AccWeekly = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const [metricDownloadLink, setMetricDownloadLink] = useState(null);
  const [dutchieDownloadLink, setDutchieDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [filename, setFilename] = useState(null);

  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:5000"
      : "https://api.morgotools.com";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const sendEmail = () => {
    if (!filename) {
      alert("No file has been uploaded yet.");
      return;
    }
    let recipientEmail;
    let city;
    if (filename.includes('Marengo')) {
      recipientEmail = 'marengoinventory@verdantcreations.com';
      city = 'Marengo';
    } else if (filename.includes('Columbus')) {
      recipientEmail = 'columbusinventory@verdantcreations.com';
      city = 'Columbus';
    } else {
      alert("Unable to determine recipient email from filename.");
      return;
    }
    const currentDate = new Date().toLocaleDateString('en-US');
    const subject = encodeURIComponent(`${city} Weekly File ${currentDate}`);
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}`;
    window.open(mailtoLink, '_blank');
  };

  const handleFileDrop = useCallback((acceptedFiles, fileType) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    console.log(`Uploading ${fileType} file:`, acceptedFiles[0].name);

    axios
      .post(`${baseUrl}/upload/${fileType}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(`Response from server for ${fileType}:`, response.data);
        const filename = response.data.filename;
        setFilename(filename);
        const downloadUrl = `${baseUrl}/download/${fileType}/${filename}`;
        if (fileType === 'metric') {
          setMetricDownloadLink(downloadUrl);
        } else {
          setDutchieDownloadLink(downloadUrl);
        }
        console.log(`Download link set for ${fileType}:`, downloadUrl);
      })
      .catch((error) => {
        console.error(`Error uploading ${fileType} file:`, error);
        const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
        setError(`Error uploading ${fileType} file: ${errorMessage}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [baseUrl]);

  const onMetricDrop = useCallback((acceptedFiles) => {
    handleFileDrop(acceptedFiles, 'metric');
  }, [handleFileDrop]);

  const onDutchieDrop = useCallback((acceptedFiles) => {
    handleFileDrop(acceptedFiles, 'dutchie');
  }, [handleFileDrop]);

  const { getRootProps: getMetricRootProps, getInputProps: getMetricInputProps, isDragActive: isMetricDragActive } = useDropzone({
    onDrop: onMetricDrop,
    accept: ".csv",
  });

  const { getRootProps: getDutchieRootProps, getInputProps: getDutchieInputProps, isDragActive: isDutchieDragActive } = useDropzone({
    onDrop: onDutchieDrop,
    accept: ".csv",
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Accounting Weekly</h1>
      <div className="row">
        <div className="col-md-6 mb-4" data-aos="fade-right">
          <h2 className="text-center">Metric File Drop</h2>
          <div className="card mt-3" style={{ margin: "30px" }}>
            <div className="card-body">
              <div {...getMetricRootProps({ className: "dropzone" })}>
                <input {...getMetricInputProps()} />
                {isMetricDragActive ? (
                  <p>Drop the Metric CSV file here ...</p>
                ) : (
                  <p>Drag 'n' drop a Metric CSV file here, or click to select one</p>
                )}
              </div>
              {isLoading && <p>Processing file...</p>}
              {error && <p className="text-danger">{error}</p>}
              {metricDownloadLink && (
                <div>
                  <div className="alert alert-success" role="alert" style={{ marginTop: "10px" }}>
                    <p className="text-center">Metric file processed successfully!</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <a href={metricDownloadLink} download className="btn btn-primary mt-3">
                      Download Processed Metric File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4" data-aos="fade-left">
          <h2 className="text-center">Dutchie File Drop for Verdant Staff</h2>
          <div className="card mt-3" style={{ margin: "30px" }}>
            <div className="card-body">
              <div {...getDutchieRootProps({ className: "dropzone" })}>
                <input {...getDutchieInputProps()} />
                {isDutchieDragActive ? (
                  <p>Drop the Dutchie CSV file here ...</p>
                ) : (
                  <p>Drag 'n' drop a Dutchie CSV file here, or click to select one</p>
                )}
              </div>
              {isLoading && <p>Processing file...</p>}
              {error && <p className="text-danger">{error}</p>}
              {dutchieDownloadLink && (
                <div>
                  <div className="alert alert-success" role="alert" style={{ marginTop: "10px" }}>
                    <p className="text-center">Dutchie file processed successfully!</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <a href={dutchieDownloadLink} download className="btn btn-primary mt-3">
                      Download Processed Dutchie File
                    </a>
                  </div>
                  {filename && (
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                      <button onClick={sendEmail} className="btn btn-success mt-3">
                        Send Email
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccWeekly;