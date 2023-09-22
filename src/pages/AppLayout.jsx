// import AppNav from "../components/AppNav";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import User from "../components/User";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const { isAuth } = useAuth();
  console.log(isAuth);
  return (
    <div className={styles.app}>
      {isAuth && <User />}
      <Sidebar />
      <Map />
    </div>
  );
}

export default AppLayout;
