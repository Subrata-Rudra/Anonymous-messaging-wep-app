import "../styles/Navbar.css";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/inbox">Inbox</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
