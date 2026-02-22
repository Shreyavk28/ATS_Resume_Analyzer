import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadCenter from "./pages/UploadCenter";
import ATSReport from "./pages/ATSReport";
import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout";

function App() {

  return (

    <BrowserRouter>

      <Layout>

        <Routes>

          <Route path="/" element={<UploadCenter />} />

          <Route path="/report" element={<ATSReport />} />

          <Route path="/recruiter" element={<Dashboard />} />

        </Routes>

      </Layout>

    </BrowserRouter>

  );

}

export default App;