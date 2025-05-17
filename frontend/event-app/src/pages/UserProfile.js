import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Typography,
  Avatar,
  Descriptions,
  Spin,
  Alert,
  Button,
  Upload,
  Modal,
  theme as antdTheme,
  message,
} from "antd";
import { UserOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";
import { updateProfilePicture, clearError } from "../features/auth/authSlice";
import ChangePasswordModal from "../components/ChangePasswordModal";

const { Title, Text } = Typography;
const { useToken } = antdTheme;

const UserProfile = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);
  const { token } = useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);

  const handleOpenChangePasswordModal = () => {
    dispatch(clearError());
    setIsChangePasswordModalVisible(true);
  };

  const handleCancelChangePasswordModal = () => {
    setIsChangePasswordModalVisible(false);
    dispatch(clearError());
  };

  const handleUploadProfilePicture = async (info) => {
    const file = info.file;
    if (!file) return;

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("You can only upload JPG/PNG file!");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Image must smaller than 2MB!");
      return;
    }

    setUploading(true);
    try {
      const resultAction = await dispatch(updateProfilePicture(file));
      if (updateProfilePicture.fulfilled.match(resultAction)) {
        messageApi.success("Profile picture updated successfully!");
      } else {
        const errorMessage =
          resultAction.payload?.message ||
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "Could not update profile picture. Please try again.";
        messageApi.error(errorMessage);
      }
    } catch (err) {
      messageApi.error("An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading && !user && !uploading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 200px)",
        }}
      >
        <Spin tip="Loading profile..." size="large" />
      </div>
    );
  }

  if (authError) {
    return (
      <Alert
        message="Error"
        description={
          typeof authError === "string" ? authError : authError?.message
        }
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (!user) {
    return (
      <Alert
        message="Not Authenticated"
        description="Please log in to view your profile."
        type="warning"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      {contextHolder}
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        User Profile
      </Title>
      <Card style={{ background: token.colorBgElevated }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Spin spinning={uploading} tip="Uploading...">
            <Avatar
              size={128}
              icon={<UserOutlined />}
              src={user?.profilePicture}
            />
          </Spin>
          <Upload
            name="profilePicture"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUploadProfilePicture({ file });
              return false;
            }}
            disabled={uploading}
            style={{ marginTop: "10px" }}
          >
            <Button
              icon={<UploadOutlined />}
              loading={uploading}
              disabled={uploading}
              style={{ marginTop: "10px" }}
            >
              Change Profile Picture
            </Button>
          </Upload>
        </div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">
            {user.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.email || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Text style={{ textTransform: "capitalize" }}>
              {user.role || "N/A"}
            </Text>
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            icon={<EditOutlined />}
            onClick={handleOpenChangePasswordModal}
          >
            Change Password
          </Button>
        </div>
      </Card>
      <ChangePasswordModal
        open={isChangePasswordModalVisible}
        onCancel={handleCancelChangePasswordModal}
        messageApi={messageApi}
      />
    </div>
  );
};

export default UserProfile;
