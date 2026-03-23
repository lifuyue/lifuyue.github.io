import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { WorkDetail } from '@/pages/WorkDetail';
import { Works } from '@/pages/Works';

export default function App() {
  const location = useLocation();

  return (
    <>
      <SmoothScroll />
      <LoadingScreen />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-24">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/works"
              element={
                <PageTransition>
                  <Works />
                </PageTransition>
              }
            />
            <Route
              path="/works/:slug"
              element={
                <PageTransition>
                  <WorkDetail />
                </PageTransition>
              }
            />
            <Route
              path="/blog"
              element={
                <PageTransition>
                  <Blog />
                </PageTransition>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <PageTransition>
                  <BlogPost />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
