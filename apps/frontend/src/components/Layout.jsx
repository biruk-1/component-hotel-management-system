import MetaInsightsPeek from "./MetaInsightsPeek";
import OperationalGuide from "./OperationalGuide";

function Layout({ children }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              ◆
            </span>
            <div>
              <p className="brand-title">StayGrid</p>
              <p className="brand-tagline">Hotel room operations</p>
            </div>
          </div>
          <nav className="app-nav" aria-label="Primary">
            <span className="nav-pill nav-pill-active">Rooms</span>
          </nav>
        </div>
      </header>
      {children}
      <div className="app-panels">
        <div className="app-panels-inner">
          <MetaInsightsPeek />
          <OperationalGuide />
        </div>
      </div>
      <footer className="app-footer">
        <p>
          Hotel monorepo demo — start API and UI with{" "}
          <code className="inline-code">npm run dev</code> from the repo root.
        </p>
      </footer>
    </div>
  );
}
export default Layout;
