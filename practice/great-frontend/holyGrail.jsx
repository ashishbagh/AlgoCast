export default function App() {
  return (
    <>
      <header
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        Header
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly;",
          width: "100%",
          height: "200px",
        }}
      >
        <nav
          style={{ width: "25%", display: "flex", justifyContent: "center" }}
        >
          Navigation
        </nav>
        <main
          style={{ width: "50%", display: "flex", justifyContent: "center" }}
        >
          Main
        </main>
        <aside
          style={{ width: "25%", display: "flex", justifyContent: "center" }}
        >
          Sidebar
        </aside>
      </div>
      <footer
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        Footer
      </footer>
    </>
  );
}
