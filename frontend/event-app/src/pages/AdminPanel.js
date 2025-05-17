import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
  Spin,
  Alert,
  App as AntdApp,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  createEventByAdmin,
  updateEventByAdmin,
  deleteEventByAdmin,
  fetchEvents,
  clearEventsError,
} from "../features/events/eventsSlice.js";
import moment from "moment";
import EventForm from "../components/admin/EventForm";

const AdminPanel = () => {
  const { events, loading, error } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] =
    useState(false);
  const [eventToDeleteInfo, setEventToDeleteInfo] = useState(null);

  const { message: messageApi } = AntdApp.useApp();

  useEffect(() => {
    dispatch(fetchEvents({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleOpenModal = (eventToEdit = null) => {
    setEditingEvent(null);
    setFileList([]);
    setTimeout(() => {
      form.resetFields();
      if (eventToEdit) {
        setEditingEvent(eventToEdit);
        const formValues = {
          ...eventToEdit,
          date: eventToEdit.date ? moment(eventToEdit.date) : null,
          image: [],
        };
        if (eventToEdit.image && typeof eventToEdit.image === "string") {
          const mockFile = {
            uid: eventToEdit._id || "-1",
            name:
              eventToEdit.image.substring(
                eventToEdit.image.lastIndexOf("/") + 1
              ) || "image.png",
            status: "done",
            url: eventToEdit.image,
          };
          setFileList([mockFile]);
          formValues.image = [mockFile];
        }
        form.setFieldsValue(formValues);
      }
    }, 0);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
    setFileList([]);
  };

  const handleSubmit = async (values) => {
    const isEditing = !!values._id;
    const formData = new FormData();
    let operationSuccessful = false;

    Object.keys(values).forEach((key) => {
      if (key === "_id") return;
      if (key === "date" && values.date) {
        formData.append(key, values.date.toISOString());
      } else if (key === "image") {
        return;
      } else if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      let resultAction;
      if (isEditing) {
        resultAction = await dispatch(
          updateEventByAdmin({
            eventId: values._id,
            eventFormData: formData,
          })
        );
        if (updateEventByAdmin.fulfilled.match(resultAction)) {
          messageApi.success("Event updated successfully!");
          operationSuccessful = true;
        } else {
          const errorPayload = resultAction.payload || resultAction.error;
          const errorMessage =
            errorPayload?.message ||
            (typeof errorPayload === "string"
              ? errorPayload
              : "Failed to update event.");
          messageApi.error(errorMessage);
          dispatch(clearEventsError());
        }
      } else {
        resultAction = await dispatch(createEventByAdmin(formData));
        if (createEventByAdmin.fulfilled.match(resultAction)) {
          messageApi.success("Event created successfully!");
          operationSuccessful = true;
        } else {
          const errorPayload = resultAction.payload || resultAction.error;
          const errorMessage =
            errorPayload?.message ||
            (typeof errorPayload === "string"
              ? errorPayload
              : "Failed to create event.");
          messageApi.error(errorMessage);
          dispatch(clearEventsError());
        }
      }
    } catch (err) {
      const errorMessage =
        err?.message ||
        (typeof err === "string" ? err : "An unexpected error occurred.");
      messageApi.error(errorMessage);
      dispatch(clearEventsError());
    }

    setIsModalVisible(false);

    if (operationSuccessful) {
      setFileList([]);
      setEditingEvent(null);
      dispatch(fetchEvents({ page: 1, limit: 100 }));
    }
  };

  const handleShowDeleteConfirm = (record) => {
    setEventToDeleteInfo({ _id: record._id, name: record.name });
    setIsDeleteConfirmModalVisible(true);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!eventToDeleteInfo) return;
    const { _id, name } = eventToDeleteInfo;

    try {
      const resultAction = await dispatch(deleteEventByAdmin(_id));
      if (deleteEventByAdmin.fulfilled.match(resultAction)) {
        messageApi.success(`Event "${name}" deleted successfully!`);
        dispatch(fetchEvents({ page: 1, limit: 100 }));
      } else {
        const errorPayload = resultAction.payload || resultAction.error;
        const errorMessage =
          errorPayload?.message ||
          (typeof errorPayload === "string"
            ? errorPayload
            : "Failed to delete event.");
        messageApi.error(errorMessage);
        dispatch(clearEventsError());
      }
    } catch (err) {
      messageApi.error("An unexpected error occurred during deletion.");
      dispatch(clearEventsError());
    }
    setIsDeleteConfirmModalVisible(false);
    setEventToDeleteInfo(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModalVisible(false);
    setEventToDeleteInfo(null);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
    { title: "Venue", dataIndex: "venue", key: "venue" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleOpenModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleShowDeleteConfirm(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => handleOpenModal()}
        style={{ marginBottom: 16 }}
      >
        Add Event
      </Button>

      {error && (
        <Alert
          message="Error"
          description={error.message || JSON.stringify(error)}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={loading}>
        <Table dataSource={events} columns={columns} rowKey="_id" />
      </Spin>

      <Modal
        title={editingEvent ? "Edit Event" : "Add Event"}
        open={isModalVisible}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <EventForm
          formInstance={form}
          onFinish={handleSubmit}
          initialValues={editingEvent}
          fileList={fileList}
          onFileListChange={setFileList}
        />
      </Modal>

      <Modal
        title="Confirm Delete Event"
        open={isDeleteConfirmModalVisible}
        onOk={handleConfirmDeleteEvent}
        onCancel={handleCancelDelete}
        okText="Yes, Delete It"
        okType="danger"
        cancelText="No, Keep It"
      >
        {eventToDeleteInfo && (
          <p>
            Are you sure you want to delete the event "
            <strong>{eventToDeleteInfo.name}</strong>"? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default AdminPanel;
