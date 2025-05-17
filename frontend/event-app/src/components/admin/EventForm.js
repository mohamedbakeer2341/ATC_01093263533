import React from "react";
import { Form, Input, DatePicker, InputNumber, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment"; // Ensure moment is imported if used for default/initial values

// normFile utility function, can be kept here or passed as prop if preferred
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const EventForm = ({
  formInstance,
  onFinish,
  initialValues,
  fileList,
  onFileListChange,
}) => {
  // If initialValues.date exists and is a string, convert it to a moment object for DatePicker
  const processedInitialValues = initialValues
    ? {
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : null,
      }
    : {};

  return (
    <Form
      form={formInstance}
      layout="vertical"
      onFinish={onFinish}
      initialValues={processedInitialValues} // Use processed values
    >
      {/* Hidden field to store the event ID when editing, if initialValues contains it */}
      {initialValues?._id && (
        <Form.Item name="_id" hidden>
          <Input />
        </Form.Item>
      )}
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input the event name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please input the event description!" },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="Category"
        name="category"
        rules={[
          { required: true, message: "Please input the event category!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Date & Time"
        name="date"
        rules={[
          { required: true, message: "Please select the event date and time!" },
        ]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        label="Venue"
        name="venue"
        rules={[{ required: true, message: "Please input the event venue!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[
          { required: true, message: "Please input the event price!" },
          { type: "number", min: 0, transform: (value) => Number(value) },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Capacity"
        name="capacity"
        rules={[
          { required: true, message: "Please input the event capacity!" },
          { type: "integer", min: 1, transform: (value) => Number(value) },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Event Image"
        name="image" // This name should match the one expected by onFinish and Upload
        valuePropName="fileList"
        getValueFromEvent={normFile} // Use the normFile function
        extra="Upload JPG, PNG. Max 1 file."
      >
        <Upload
          name="image_upload_field" // Internal name for upload, not directly used by Form data
          listType="picture"
          maxCount={1}
          beforeUpload={() => false} // We handle upload manually
          onRemove={() => onFileListChange([])} // Update parent state
          onChange={(info) => onFileListChange(info.fileList)} // Update parent state
          fileList={fileList} // Controlled component
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default EventForm;
