import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventById,
  bookEventTicket,
  clearSelectedEvent,
} from "../features/events/eventsSlice";
import {
  Spin,
  Alert,
  Row,
  Col,
  Image,
  Typography,
  Button,
  Card,
  Tag,
  Descriptions,
  message,
  theme as antdTheme,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { useToken } = antdTheme;

const EventDetail = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    selectedEvent: event,
    selectedEventLoading: loading,
    selectedEventError: error,
    bookingLoading,
    bookingError,
  } = useSelector((state) => state.events);

  const { token } = useToken();

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
    }
    return () => {
      dispatch(clearSelectedEvent());
    };
  }, [dispatch, eventId]);

  const handleBookNow = async () => {
    if (!eventId) return;
    const resultAction = await dispatch(bookEventTicket(eventId));
    if (bookEventTicket.fulfilled.match(resultAction)) {
      message.success("Event booked successfully!");
      navigate("/congrats");
    } else {
      if (resultAction.payload && resultAction.payload.message) {
        message.error(`Booking failed: ${resultAction.payload.message}`);
      } else {
        message.error("Booking failed. Please try again.");
      }
    }
  };

  const bookNowButtonStyle = {
    marginTop: "16px",
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
    borderColor: token.colorPrimary,
    borderWidth: "1px",
    borderStyle: "solid",
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 128px)",
        }}
      >
        <Spin size="large" tip="Loading event details..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading event"
        description={
          typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error)
        }
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (!event) {
    return (
      <Alert
        message="Event not found"
        description="The event you are looking for does not exist or could not be loaded."
        type="warning"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date not available";

  return (
    <Card style={{ margin: "20px", background: token.colorBgElevated }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <Image
            width="100%"
            src={
              event.image || "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={event.name}
            style={{
              borderRadius: "8px",
              objectFit: "cover",
              maxHeight: "400px",
            }}
          />
        </Col>
        <Col xs={24} md={14}>
          <Title level={2}>{event.name}</Title>
          <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "more" }}>
            {event.description || "No description available."}
          </Paragraph>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={
                <>
                  <TagOutlined /> Category
                </>
              }
            >
              <Tag color="blue">{event.category || "N/A"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <CalendarOutlined /> Date & Time
                </>
              }
            >
              {eventDate}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined /> Venue
                </>
              }
            >
              {event.venue || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <DollarCircleOutlined /> Price
                </>
              }
            >
              {event.price !== undefined
                ? `$${Number(event.price).toFixed(2)}`
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>

          {bookingError && (
            <Alert
              message="Booking Error"
              description={
                typeof bookingError === "string"
                  ? bookingError
                  : bookingError?.message || JSON.stringify(bookingError)
              }
              type="error"
              showIcon
              style={{ marginTop: "16px" }}
            />
          )}

          {event.userHasBooked ? (
            <Tag
              color="green"
              style={{ marginTop: "16px", padding: "10px", fontSize: "16px" }}
            >
              You have already booked this event.
            </Tag>
          ) : (
            <Button
              size="large"
              onClick={handleBookNow}
              loading={bookingLoading}
              disabled={bookingLoading}
              style={bookNowButtonStyle}
            >
              Book Now
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default EventDetail;
