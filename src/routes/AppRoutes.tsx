import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import Leave from '@/pages/Leave';
import Dashboard from '@/pages/Dashboard';
const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<div>Home page</div>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/leave' element={<Leave />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes;
