import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Spin, theme as antdTheme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetail from "./pages/EventDetail";
import AdminPanel from "./pages/AdminPanel";
import Congrats from "./pages/Congrats";
import MyBookings from "./pages/MyBookings";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/navbar";
import { fetchUserProfile } from "./features/auth/authSlice";

const { Content } = Layout;
const { useToken } = antdTheme;

function App() {
  const dispatch = useDispatch();
  const {
    token: authToken,
    user,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const currentThemeMode = useSelector((state) => state.theme.mode);

  const { token } = useToken();

  useEffect(() => {
    if (authToken && !user && !authLoading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, authToken, user, authLoading]);

  if (authLoading && authToken && !user) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Spin size="large" tip="Loading application..." />
      </Layout>
    );
  }

  return (
    <BrowserRouter>
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: token.colorBgLayout,
        }}
      >
        <Navbar />
        <Content style={{ padding: "0px", marginTop: "64px" }}>
          <div
            style={{
              background: token.colorBgContainer,
              padding: 24,
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/event/:id" element={<EventDetail />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/congrats" element={<Congrats />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Routes>
          </div>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
