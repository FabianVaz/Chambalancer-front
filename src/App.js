import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProviderRegisterPage from "./pages/ProviderRegisterPage";
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import ClientHomePage from "./pages/ClientHomePage";
import HomePage from "./pages/HomePage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import PublishServicePage from "./pages/PublishServicePage";
import RequestServicePage from "./pages/RequestServicePage";
import MyRequestsPage from "./pages/MyRequestsPage";
import ServiceProviderPage from "./pages/ServiceProviderPage";
import EditServicePage from "./pages/EditServicePage";
import ProviderRequestPage from "./pages/ProviderRequestPage";
import PayServicePage from "./pages/PayServicePage";
import ClientProfilePage from "./pages/ClientProfilePage";
import CreateReviewPage from "./pages/CreateReviewPage";
import DashboardPage from "./pages/DashboarPage";
import './chartConfig';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-provider" element={<ProviderRegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />
        <Route path="/provider-profile" element={<ProviderProfilePage />} />
        <Route path="/client-home" element={<ClientHomePage />} />
        <Route path="/service-details/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/publish-service" element={<PublishServicePage />} />
        <Route path="/request-service" element={<RequestServicePage />} />
        <Route path="/my-requests" element={<MyRequestsPage />} />
        <Route path="/service-provider/:serviceId" element={ <ServiceProviderPage />} />
        <Route path="/edit-service/:serviceId" element={ <EditServicePage />} />
        <Route path="/provider-requests" element={ <ProviderRequestPage />} />
        <Route path="/client-profile" element={<ClientProfilePage />} />
        <Route path="/create-review/:requestId" element={<CreateReviewPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/pay-service/:id" element={<PayServicePage />} />
      </Routes>
    </Router>
  );
};
export default App;
