import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'
import PageWrapper from '../components/PageWrapper'

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Navbar />
      <PageWrapper>
        <Container>
          <Outlet />
        </Container>
      </PageWrapper>
      <Footer />
    </div>
  )
}

export default MainLayout
