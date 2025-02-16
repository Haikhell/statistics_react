import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StatisticsTable from "./components/Statistics";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={< StatisticsTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
