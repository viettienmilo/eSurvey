import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router"
import Layout from './components/Layout'
import Home from './pages/Home'
import Survey from './pages/Survey'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/started" element={<Survey />} />
    </Route>
  )
)

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
