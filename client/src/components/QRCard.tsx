import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { saveAs } from 'file-saver';

interface QRCardProps {
  siteId: string;
  clientName: string;
  address: string;
  qrValue: string;
  onReportIssue?: (siteId: string) => void;
}

const QRCard: React.FC<QRCardProps> = ({
  siteId,
  clientName,
  address,
  qrValue,
  onReportIssue
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Handle printing the QR code
  const handlePrint = useReactToPrint({
    content: () => qrRef.current,
    documentTitle: `QR_${siteId}_${clientName}`,
  });
  
  // Handle downloading the QR code as PNG
  const handleDownload = () => {
    const canvas = document.getElementById(`qr-canvas-${siteId}`) as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `QR_${siteId}_${clientName}.png`);
        }
      });
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row gap-4">
        {/* QR Code Section */}
        <div ref={qrRef} className="p-4 bg-white rounded-lg">
          <div className="flex flex-col items-center">
            <QRCodeSVG
              id={`qr-canvas-${siteId}`}
              value={qrValue}
              size={150}
              level="H"
              includeMargin
            />
            <div className="mt-2 text-center">
              <p className="font-bold">{clientName}</p>
              <p className="text-sm text-gray-600">{address}</p>
              <p className="text-xs text-gray-500">Site ID: {siteId}</p>
            </div>
          </div>
        </div>
        
        {/* Actions Section */}
        <div className="flex flex-col justify-center space-y-2 p-4">
          <button
            onClick={handlePrint}
            className="btn btn-primary flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print
          </button>
          
          <button
            onClick={handleDownload}
            className="btn btn-secondary flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
          
          {onReportIssue && (
            <button
              onClick={() => onReportIssue(siteId)}
              className="btn btn-outline flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Report Issue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCard;
