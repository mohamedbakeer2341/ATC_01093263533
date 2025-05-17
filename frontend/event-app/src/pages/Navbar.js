import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Menu mode="horizontal">
      {isAuthenticated && (
        <>
          <Menu.Item key="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          {user?.role === "admin" && (
            <Menu.Item key="admin">
              <Link to="/admin">Admin</Link>
            </Menu.Item>
          )}
          <Menu.Item key="logout">
            <Button danger onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default Navbar;
