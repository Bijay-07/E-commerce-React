import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
 
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
 
export default MainLayout;