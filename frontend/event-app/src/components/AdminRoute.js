import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Layout, Spin, Result, Button } from "antd"; // For loading spinner and unauthorized message
import { Link } from "react-router-dom";

const AdminRoute = () => {
  const { isAuthenticated, user, loading, token } = useSelector(
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
        <Spin size="large" tip="Verifying admin access..." />
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role === "admin") {
    return <Outlet />;
  } else {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Result
          status="403"
          title="403 - Forbidden"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary">
              <Link to="/">Back Home</Link>
            </Button>
          }
        />
      </Layout>
    );
  }
};

export default AdminRoute;
