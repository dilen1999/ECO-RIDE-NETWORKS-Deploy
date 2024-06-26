import React, { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./QrCodeGenerator.css";

function QrCodeGenerator({ bikeDetails, handleQrWindowClose }) {
  const [url, setUrl] = useState("");
  const [qrIsVisible, setQrIsVisible] = useState(false);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (bikeDetails) {
      const detailsString = `Bike ID: ${bikeDetails.bikeId}, Brand: ${bikeDetails.brand}, Model: ${bikeDetails.bikeModel}, Code: ${bikeDetails.bikeCode}, Color: ${bikeDetails.color}, Station ID: ${bikeDetails.initStationId}`;
      setUrl(detailsString);
    }
  }, [bikeDetails]);

  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Bike_ID_${bikeDetails.bikeId}.png`;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
      });
  };

  return (
    <div className="qrcode__container">
      <div className="closeQrWindow">
        <FontAwesomeIcon onClick={handleQrWindowClose} icon={faClose} />
      </div>
      <h1 style={{ textAlign: 'center' }}>QR Code Generator</h1>
      <div className="qrcode__container--parent">
        <div className="qrcode__input">
          <input
            type="text"
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={() => setQrIsVisible(true)}>Generate QR Code</button>
        </div>
        {qrIsVisible && (
          <div className="qrcode__download">
            <div className="qrcode__element" ref={qrCodeRef}>
              <QRCode value={url} size={256} />
            </div>
            <button onClick={downloadQRCode}>Download QR Code</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QrCodeGenerator;
