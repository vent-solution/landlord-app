import React from "react";
import QRCode from "react-qr-code";

interface Props {
  value: string;
  size: number;
  bgColor: string;
  fgColor: string;
  level: string;
}

let QRCodeGenerator: React.FC<Props> = ({
  value,
  size,
  bgColor,
  fgColor,
  level,
}) => {
  return (
    <div className="App">
      {value && (
        <QRCode
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
        />
      )}
    </div>
  );
};

QRCodeGenerator = React.memo(QRCodeGenerator);

export default QRCodeGenerator;
