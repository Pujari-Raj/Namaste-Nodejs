import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Base from "./components/Base";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./utils/store";
import Feed from "./components/Feed";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Base />}>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
