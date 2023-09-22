import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import Button from "./Button";
import { useAuth } from "../contexts/FakeAuthContext";
function PageNav() {
  const { isAuth, logout } = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">product</NavLink>
        </li>
        <li>
          {isAuth && (
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              logout
            </Button>
          )}
          {!isAuth && (
            <NavLink to="/login" className={styles.ctaLink}>
              login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
