import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Base from "./components/Base";
import Login from "./components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Base/>}>
              <Route path="/login" element={<Login/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
