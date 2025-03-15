import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const FileDrop = ({ colId }) => {
  const [downloadLink, setDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);

  // const baseUrl = "http://127.0.0.1:5000"; // Use this for local testing
  const baseUrl = "https://api.morgotools.com"; // Uncomment for production

  const onDrop = useCallback((acceptedFiles) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    console.log("Uploading file:", acceptedFiles[0].name);

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
    const subject = encodeURIComponent(`${city} Morning Count File ${currentDate}`);
    
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}`;
    window.open(mailtoLink, '_blank');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={`col-lg-6 ${colId}`}>
      <h2 className="text-center">Morning Count File Drop</h2>
      <div className="text-center mt-3">
        <button 
          type="button" 
          className="btn btn-info" 
          style={{ backgroundColor: '#3d6428', color: 'white', borderColor: '#3a4534' }}
          onClick={() => window.open('https://youtu.be/lFuMdu2-vlo', '_blank')}
        >
          Instructional Video
        </button>
      </div>
      <div className="card mt-3" style={{ margin: "30px" }}>
        <div className="card-body">
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
                {/* bootstrap primary button */}
                
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
        </div>
      </div>
    </div>
  );
};

export default FileDrop;