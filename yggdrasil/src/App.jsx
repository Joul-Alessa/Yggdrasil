import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './HomePage.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:profile" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
