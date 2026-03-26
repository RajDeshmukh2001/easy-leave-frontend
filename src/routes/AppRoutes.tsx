import Layout from '@/components/Layout'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
const AppRoutes = () : React.JSX.Element => {
  return (
    <Routes>
        <Route element={<Layout/>}>
          <Route path="/#"/>
        </Route>
    </Routes>
  )
}

export default AppRoutes
