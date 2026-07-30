import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Routes>
      <Route path="/*" element={<MainLayout />}>
        <Route path="*" element={<AppRoutes />} />
      </Route>
    </Routes>
  )
}

export default App
