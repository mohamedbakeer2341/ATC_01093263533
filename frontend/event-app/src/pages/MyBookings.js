import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  Typography,
  Alert,
  Spin,
  Empty,
  Button,
  Modal,
  message,
  theme as antdTheme,
} from "antd";
import { Link } from "react-router-dom";
import {
  fetchUserBookings,
  cancelBooking,
} from "../features/bookings/bookingsSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { useToken } = antdTheme;

const MyBookings = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = useToken();
  const { bookings, loading, error, cancelling } = useSelector(
    (state) => state.bookings
  );
  const { user } = useSelector((state) => state.auth);

  // --- Debug: Check for user object reference stability ---
  const prevUserRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const deleteEvent = async () => {
    console.log(
      "[MyBookings] deleteEvent called. Selected Booking:",
      selectedBooking
    );
    const id = selectedBooking?.id;
    console.log("[MyBookings] Booking ID for cancellation:", id);
    if (!id) {
      messageApi.error("Booking ID is missing. Cannot cancel.");
      setIsModalOpen(false);
      setSelectedBooking(null); // Clear selected booking if ID is missing
      return;
    }
    try {
      // Ensure you are dispatching and then handling the promise correctly if it's an async thunk
      const resultAction = await dispatch(cancelBooking(id));
      console.log("[MyBookings] cancelBooking resultAction:", resultAction);

      if (cancelBooking.fulfilled.match(resultAction)) {
        messageApi.success("Booking cancelled successfully!");
      } else {
        let errorMessage = "Failed to cancel booking.";
        // More robust error message extraction
        if (resultAction.payload && resultAction.payload.message) {
          errorMessage = resultAction.payload.message;
        } else if (
          resultAction.payload &&
          typeof resultAction.payload === "string"
        ) {
          errorMessage = resultAction.payload;
        } else if (resultAction.error && resultAction.error.message) {
          errorMessage = resultAction.error.message;
        } else if (typeof resultAction.payload === "object") {
          // Fallback for object payloads
          errorMessage = JSON.stringify(resultAction.payload);
        }
        messageApi.error(`Cancellation failed: ${errorMessage}`);
      }
    } catch (err) {
      console.error("[MyBookings deleteEvent] Unexpected error:", err);
      messageApi.error("An unexpected error occurred during cancellation.");
    } finally {
      // Always close modal and clear selection in finally block
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    console.log("[MyBookings] openModal called. Booking:", booking);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    if (prevUserRef.current && prevUserRef.current !== user) {
      console.warn(
        "[MyBookings] WARNING: User object reference has changed between renders.",
        { previous: prevUserRef.current, current: user }
      );
    }
    prevUserRef.current = user;
  }, [user]);
  // --- End Debug ---

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, user]);

  const showCancelConfirm = (bookingId, eventName) => {
    confirm({
      title: `Are you sure you want to cancel your booking for "${eventName}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, cancel it",
      okType: "danger",
      cancelText: "No",
      // onOk: async () => {
      //   console.log(
      //     "[MyBookings] Modal.confirm OK button CLICKED. Booking ID:",
      //     bookingId
      //   );
      //   try {
      //     const resultAction = await dispatch(cancelBooking(bookingId));
      //     if (cancelBooking.fulfilled.match(resultAction)) {
      //       messageApi.success("Booking cancelled successfully!");
      //     } else {
      //       let errorMessage = "Failed to cancel booking.";
      //       if (resultAction.payload) {
      //         errorMessage =
      //           typeof resultAction.payload === "string"
      //             ? resultAction.payload
      //             : JSON.stringify(resultAction.payload);
      //       } else if (resultAction.error && resultAction.error.message) {
      //         errorMessage = resultAction.error.message;
      //       }
      //       messageApi.error(`Cancellation failed: ${errorMessage}`);
      //     }
      //   } catch (err) {
      //     console.error("[MyBookings Cancel OnOk] Unexpected error:", err);
      //     messageApi.error("An unexpected error occurred during cancellation.");
      //   }
      // },
    });
  };

  if (loading && bookings.length === 0) {
    return (
      <>
        {contextHolder}
        <Spin
          tip="Loading your bookings..."
          size="large"
          style={{ display: "block", marginTop: "50px" }}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        {contextHolder}
        <Alert
          message="Error fetching bookings"
          description={
            typeof error === "string" ? error : JSON.stringify(error)
          }
          type="error"
          showIcon
          style={{ marginTop: "20px" }}
        />
      </>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <Title level={2} style={{ marginBottom: "20px" }}>
        My Bookings
      </Title>
      {bookings && bookings.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={bookings}
          renderItem={(booking) => {
            return (
              <List.Item
                key={booking.id}
                actions={[
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      openModal(booking);
                    }}
                    loading={cancelling === booking.id}
                    disabled={cancelling === booking.id}
                  >
                    Cancel Booking
                  </Button>,
                  <Link to={`/event/${booking.eventId}`}>
                    <Button
                      style={{
                        color: token.colorPrimary,
                        borderColor: token.colorPrimary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                      }}
                    >
                      View Event Details
                    </Button>
                  </Link>,
                ]}
                extra={
                  booking.eventImage && (
                    <img
                      width={150}
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                        maxHeight: "100px",
                      }}
                      alt={booking.eventName}
                      src={booking.eventImage}
                    />
                  )
                }
              >
                <List.Item.Meta
                  title={
                    <Link to={`/event/${booking.eventId}`}>
                      {booking.eventName || "Event Name Not Available"}
                    </Link>
                  }
                  description={
                    <>
                      <Text strong>Date:</Text>{" "}
                      {booking.eventDate
                        ? new Date(booking.eventDate).toLocaleDateString()
                        : "N/A"}
                      <br />
                      <Text strong>Venue:</Text> {booking.eventVenue || "N/A"}
                      <br />
                      {booking.eventCategory && (
                        <>
                          <Text strong>Category:</Text> {booking.eventCategory}
                          <br />
                        </>
                      )}
                      <Text strong>Booked On:</Text>{" "}
                      {booking.bookedAt
                        ? new Date(booking.bookedAt).toLocaleDateString()
                        : "N/A"}
                      <br />
                      {booking.eventPrice !== undefined && (
                        <>
                          <Text strong>Price:</Text> $
                          {booking.eventPrice.toFixed(2)}
                        </>
                      )}
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      ) : (
        !loading && (
          <Empty
            description="You have no bookings yet. Why not explore some events?"
            style={{ marginTop: "20px" }}
          />
        )
      )}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        onOk={deleteEvent}
        title="Booking Details"
      >
        {selectedBooking ? (
          <div>
            <p>
              <strong>Title:</strong> {selectedBooking.eventName}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.eventCategory}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.eventDate}
            </p>
            {/* Add more fields as needed */}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default MyBookings;
