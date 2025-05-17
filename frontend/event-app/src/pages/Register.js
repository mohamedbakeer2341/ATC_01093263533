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
import { registerUser, clearError } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = staticMessage.useMessage();

  useEffect(() => {
    if (isAuthenticated) {
      messageApi.success("Registration successful! Logged in.");
      navigate("/");
    }
  }, [isAuthenticated, navigate, messageApi]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Registration failed. Please try again.";
      messageApi.error(errorMessage);
      dispatch(clearError());
    }
  }, [error, dispatch, messageApi]);

  const onFinish = async (values) => {
    try {
      const resultAction = await dispatch(
        registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        messageApi.success("Registration successful! Please login.");
        navigate("/login");
      } else if (registerUser.rejected.match(resultAction)) {
        // Error message is already handled by the useEffect hook for 'error' state
        // No need to call messageApi.error here again if the useEffect handles it
      }
    } catch (err) {
      messageApi.error("An unexpected error occurred during registration.");
    }
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
        title="Register"
        style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
      >
        <Spin spinning={loading} tip="Registering...">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

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
                {
                  min: 6,
                  message: "Password must be at least 6 characters.",
                },
              ]}
            >
              <Input.Password placeholder="Choose a password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Button
                type="link"
                onClick={() => navigate("/login")}
                style={{ padding: 0 }}
              >
                Login here!
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Register;
