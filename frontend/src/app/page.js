import Navbar from "../components/Navbar";
import ProductsSection from "../components/ProductsSection";
import EnhancedFooter from "../components/EnhancedFooter";
import { PageTransition, AnimatedBackground } from "../components/PageTransition";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <PageTransition>
        <AnimatedBackground>
          <main className="relative">
            <ErrorBoundary>
              <Navbar />
            </ErrorBoundary>
            <ErrorBoundary>
              <ProductsSection />
            </ErrorBoundary>
            <ErrorBoundary>
              <EnhancedFooter />
            </ErrorBoundary>
          </main>
        </AnimatedBackground>
      </PageTransition>
    </ErrorBoundary>
  );
}
