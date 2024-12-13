import React, { useEffect } from "react";
import { bricksBuilder } from "@mercadopago/sdk-react";

const renderStatusScreenBrick = async (paymentId, threeDSInfo) => {
  const settings = {
    initialization: {
      paymentId, // ID del pago devuelto por el backend
      additionalInfo: {
        externalResourceURL: threeDSInfo.external_resource_url,
        creq: threeDSInfo.creq,
      },
    },
    callbacks: {
      onReady: () => {
        console.log("Status Screen listo.");
      },
      onError: (error) => {
        console.error("Error en el Status Screen:", error);
      },
    },
  };

  await bricksBuilder.create(
    "statusScreen",
    "statusScreenBrick_container",
    settings
  );
};

const StatusScreen = ({ paymentId, threeDSInfo }) => {
  useEffect(() => {
    renderStatusScreenBrick(paymentId, threeDSInfo);
  }, [paymentId, threeDSInfo]);

  return <div id="statusScreenBrick_container" />;
};

export default StatusScreen;
