import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const FileDrop = ({ colId }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    if (typeof window.bootstrap === 'undefined') {
      console.warn(
        "Bootstrap JavaScript is not loaded. The dropdown will not function. " +
        "Please ensure you have included the Bootstrap 5 JavaScript bundle. " +
        "Add this to your index.html: " +
        '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" ' +
        'integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" ' +
        'crossorigin="anonymous"></script>'
      );
    } else {
      console.log("Bootstrap JavaScript loaded successfully.");
    }
  }, []);

  const [downloadLink, setDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:5000"
      : "https://api.morgotools.com";

  const onDrop = useCallback((acceptedFiles) => {
    if (!selectedLocation) {
      setError("Please select a location before uploading.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("location", selectedLocation);

    console.log("Uploading file with location:", selectedLocation);

    axios
      .post(`${baseUrl}/upload/morning`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Response from server:", response.data);
        const filename = response.data.filename;
        setFilename(filename);
        const downloadUrl = `${baseUrl}/download/morning/${filename}`;
        setDownloadLink(downloadUrl);
        console.log("Download link set:", downloadUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setError("Error uploading file. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedLocation]);

  const sendEmail = () => {
    if (!filename || !selectedLocation) {
      alert("No file has been uploaded or location not selected.");
      return;
    }

    const recipientEmail =
      selectedLocation === "Marengo"
        ? "marengoinventory@verdantcreations.com"
        : "columbusinventory@verdantcreations.com";
    const city = selectedLocation;
    const currentDate = new Date().toLocaleDateString("en-US");
    const subject = encodeURIComponent(`${city} Morning Count File ${currentDate}`);
    
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}`;
    window.open(mailtoLink, "_blank");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={`col-lg-6 ${colId}`} data-aos="fade-right">
      <h2 className="text-center">Morning Count File Drop</h2>
      <div className="text-center mt-3">
        <button 
          type="button" 
          className="btn btn-info" 
          style={{ backgroundColor: "#3d6428", color: "white", borderColor: "#3a4534" }}
          onClick={() => window.open("https://youtu.be/lFuMdu2-vlo", "_blank")}
        >
          Instructional Video
        </button>
      </div>
      <div className="card mt-3" style={{ margin: "30px" }}>
        <div className="card-body">
          {!selectedLocation && (
            <div className="d-flex justify-content-center">
              <div className="btn-group mt-3">
                <button
                  type="button"
                  className="btn btn-success dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Location
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedLocation("Columbus");
                      }}
                    >
                      Columbus
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedLocation("Marengo");
                      }}
                    >
                      Marengo
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {selectedLocation && (
            <>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the file here ...</p>
                ) : (
                  <p>Drag 'n' drop an Excel file here, or click to select one</p>
                )}
              </div>
              {isLoading && <p>Processing file...</p>}
              {error && <p className="text-danger">{error}</p>}
              {downloadLink && (
                <div>
                  <div
                    className="alert alert-success"
                    role="alert"
                    style={{ marginTop: "10px" }}
                  >
                    <p className="text-center">File processed successfully!</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <a
                      href={downloadLink}
                      download
                      className="btn btn-primary mt-3"
                    >
                      Download Processed Morning File
                    </a>
                    <button onClick={sendEmail} className="btn btn-success mt-3 ml-2">
                      Send Email
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDrop;