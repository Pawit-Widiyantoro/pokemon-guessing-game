import GuessPokemonImage from "./pages/GuessPokemonImage";
import GuessPokemonName from "./pages/GuessPokemonName";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<GuessPokemonName/>} />
          <Route path="/images" element={<GuessPokemonImage/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
