import GuessPokemonImage from "./pages/GuessPokemonImage";
import GuessPokemonName from "./pages/GuessPokemonName";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-blue-500">
        <Navbar />
        {/* Routes */}
        <Routes>
          <Route path="/" element={<GuessPokemonName />} />
          <Route path="/images" element={<GuessPokemonImage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
