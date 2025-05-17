import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Layout, Spin } from "antd";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, token } = useSelector(
    (state) => state.auth
  );

  if (loading && token) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Verifying authentication..." />
      </Layout>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
