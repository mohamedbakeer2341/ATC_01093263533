import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { changePassword, clearError } from "../features/auth/authSlice";

const ChangePasswordModal = ({ open, onCancel, messageApi }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [localSuccessMessage, setLocalSuccessMessage] = useState(null);
  const [localErrorMessage, setLocalErrorMessage] = useState(null);

  // Handle success messages
  useEffect(() => {
    if (localSuccessMessage) {
      messageApi.success(localSuccessMessage);
      setLocalSuccessMessage(null);
      onCancel();
      form.resetFields();
    }
  }, [localSuccessMessage, messageApi, onCancel, form]);

  // Handle error messages
  useEffect(() => {
    if (localErrorMessage) {
      messageApi.error(localErrorMessage);
      setLocalErrorMessage(null);
      dispatch(clearError());
    }
  }, [localErrorMessage, messageApi, dispatch]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setLocalSuccessMessage(null);
    setLocalErrorMessage(null);

    try {
      const passwordData = {
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      };
      const actionResult = await dispatch(changePassword(passwordData));

      if (changePassword.fulfilled.match(actionResult)) {
        setLocalSuccessMessage("Password changed successfully!");
      } else {
        let errorMessage = "Failed to change password. Please try again.";
        if (actionResult.payload) {
          errorMessage =
            typeof actionResult.payload === "string"
              ? actionResult.payload
              : actionResult.payload.message || errorMessage;
        }
        setLocalErrorMessage(errorMessage);
      }
    } catch (error) {
      setLocalErrorMessage(
        "An unexpected error occurred while changing password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Change Password"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Change Password
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        name="changePasswordForm"
      >
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[
            { required: true, message: "Please input your old password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please input your new password!" },
            { min: 6, message: "Password must be at least 6 characters." },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
