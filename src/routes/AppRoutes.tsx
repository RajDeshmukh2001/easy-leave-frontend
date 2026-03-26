import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
const AppRoutes = () : React.JSX.Element => {
  return (
    <Routes>
        <Route element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
    </Routes>
  )
}

export default AppRoutes
