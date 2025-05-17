import React from "react";
import { Layout, Menu, Avatar, message, Switch } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  BulbOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const NavbarComponent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const currentThemeMode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    message.success("Logged out successfully!");
    navigate("/login");
  };

  const handleThemeChange = (checked) => {
    dispatch(toggleTheme());
  };

  const menuItems = [
    {
      key: "home",
      icon: <SolutionOutlined />,
      label: <Link to="/">Events</Link>,
    },
  ];

  let navigationItems = [...menuItems];

  if (isAuthenticated && user) {
    if (user.role === "admin") {
      navigationItems.push({
        key: "admin",
        icon: <DashboardOutlined />,
        label: <Link to="/admin">Admin Panel</Link>,
      });
    }
    navigationItems.push({
      key: "userMenu",
      icon: (
        <Avatar
          src={user.profilePictureUrl}
          icon={!user.profilePictureUrl && <UserOutlined />}
          size="small"
          style={{ marginRight: "0px" }}
        />
      ),
      label: user.name || "User",
      children: [
        {
          key: "my-bookings",
          icon: <ProfileOutlined />,
          label: <Link to="/my-bookings">My Bookings</Link>,
        },
        {
          key: "profile",
          icon: <UserOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: handleLogout,
        },
      ],
    });
  } else {
    navigationItems.push(
      {
        key: "login",
        icon: <LoginOutlined />,
        label: <Link to="/login">Login</Link>,
      },
      {
        key: "register",
        label: <Link to="/register">Register</Link>,
      }
    );
  }

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: currentThemeMode === "dark" ? undefined : "#fff",
        borderBottom:
          currentThemeMode === "dark"
            ? "1px solid #303030"
            : "1px solid #f0f0f0",
        padding: "0 24px",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="logo">
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          <AppstoreOutlined style={{ marginRight: "8px" }} />
          EventBooker
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Menu
          theme={currentThemeMode}
          mode="horizontal"
          selectable={false}
          items={navigationItems}
          style={{
            lineHeight: "63px",
            borderBottom: "none",
          }}
          overflowedIndicator={<span>...</span>}
        />
        <Switch
          style={{ marginLeft: "16px", marginRight: "0px" }}
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          checked={currentThemeMode === "dark"}
          onChange={handleThemeChange}
        />
      </div>
    </Header>
  );
};

export default NavbarComponent;
