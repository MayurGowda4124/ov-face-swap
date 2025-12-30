import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import "../styles/QrCodePage.css";

const QrCodePage = () => {
  const navigate = useNavigate();
  const [swappedImage, setSwappedImage] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    const imageUrl = localStorage.getItem("swappedImageUrl");
    if (!imageUrl) {
      navigate("/result");
      return;
    }
    setSwappedImage(imageUrl);
    setDownloadUrl(imageUrl);
  }, [navigate]);

  const handlePrintClick = () => {
    if (!swappedImage) return;
    
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      alert('Allow pop-ups to print the image.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              @page {
                margin: 0;
              }
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <img src="${swappedImage}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="screen third-background">
      <h2 className="qr-title">
        Scan the QR code to download your image
      </h2>
      <div className="qr-code-container">
        <div className="qr-code-frame">
          <div className="qr-container">
            <QRCode
              value={downloadUrl}
              size={300}
              level="H"
              includeMargin={true}
              renderAs="svg"
              className="qr-code"
            />
          </div>

          <div className="print-content">
            <div className="result-image-container2">
              <div className="result-wrapper">
                <img
                  src={swappedImage}
                  alt="Face Swap Result"
                  className="result-image"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button className="button print-button" onClick={handlePrintClick}>
            Print Image
          </button>
          <button
            className="button next-button"
            onClick={() => navigate("/")}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;

