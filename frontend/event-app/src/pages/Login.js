import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Spin,
  message as staticMessage,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = staticMessage.useMessage();

  useEffect(() => {
    console.log("[Login.js useEffect] Triggered. Auth state:", {
      isAuthenticated,
      loading,
      error,
    });
    if (isAuthenticated) {
      messageApi.success("Login successful!");
      navigate("/");
    }
    if (error) {
      console.log(
        "[Login.js useEffect] Error object received:",
        JSON.parse(JSON.stringify(error))
      );
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Login failed. Please try again.";
      console.log(
        "[Login.js useEffect] Displaying error message:",
        errorMessage
      );
      messageApi.error(errorMessage);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch, loading, messageApi]);

  const onFinish = (values) => {
    console.log("[Login.js onFinish] Called with values:", values);
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {contextHolder}
      <Card
        title="Login"
        style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
      >
        <Spin spinning={loading} tip="Logging in...">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Button
                type="link"
                onClick={() => navigate("/register")}
                style={{ padding: 0 }}
              >
                Register now!
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Login;
