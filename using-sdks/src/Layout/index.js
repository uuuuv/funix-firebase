import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <>
      <nav className="bg-dark text-light p-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="logo fw-bold">Storage</div>

          <ul className="d-flex align-items-center gap-2 m-0">
            <li>
              <Link className="text-light" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-light" to="/about">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="body">
        <div className="main container bg-white">{children}</div>
      </div>
    </>
  );
}

export default Layout;
