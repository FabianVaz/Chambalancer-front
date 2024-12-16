import React, { useState } from "react";
import { CardPayment, StatusScreen, initMercadoPago } from "@mercadopago/sdk-react";

// Inicializar Mercado Pago con tu Public Key
initMercadoPago("TEST-97b44964-a43e-46f9-890f-450cd7ee9d2c");

const PayServicePage = () => {
  const [challengeData, setChallengeData] = useState(null);
  const apiURL = process.env.REACT_APP_API;

  const initialization = {
    amount: 5, // Aquí puedes establecer el monto dinámico que necesites
  };

  const renderStatusScreenBrick = (paymentId, threeDsInfo) => {
    setChallengeData({
      paymentId,
      externalResourceURL: threeDsInfo.external_resource_url,
      creq: threeDsInfo.creq,
    });
  };

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${apiURL}/api/payments/process_payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (result.message === "Challenge requerido.") {
          console.log("Renderizando Challenge...");
          renderStatusScreenBrick(result.paymentId, result.three_ds_info);
        } else {
          alert(result.message);
        }
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  const onError = async (error) => {
    console.error("Error en el Brick:", error);
    alert("Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.");
  };

  const onReady = async () => {
    console.log("Brick listo para usarse");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-white shadow-md p-4 w-full text-center">
        <h1 className="text-xl font-bold">Pagar servicio</h1>
      </header>
      <main className="max-w-4xl mx-auto mt-6 w-full p-4">
        {!challengeData ? (
          <div id="cardPaymentBrick_container">
            <CardPayment
              initialization={initialization}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={onError}
            />
          </div>
        ) : (
          <div id="statusScreenBrick_container">
            <StatusScreen
              initialization={{
                paymentId: challengeData.paymentId,
                additionalInfo: {
                  externalResourceURL: challengeData.externalResourceURL,
                  creq: challengeData.creq,
                },
              }}
              customization={{
                backUrls: {
                  error: "http://localhost:3000/my-requests", // Reemplaza con tu dominio y ruta real
                  return: "http://localhost:3000/my-requests", // Reemplaza con tu dominio y ruta real
                },
              }}
              callbacks={{
                onReady: () => {
                  console.log("Status Screen Brick listo.");
                },
                onError: (error) => {
                  console.error("Error en el Status Screen Brick:", error);
                },
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default PayServicePage;
