import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import EntryPage from './components/EntryPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/entry/:id" element={<EntryPage />} />
    </Routes>
  )
}
