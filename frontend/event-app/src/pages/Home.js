import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, bookEventTicket } from "../features/events/eventsSlice";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Pagination,
  Spin,
  Alert,
  message as staticMessage,
  theme as antdTheme,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

const { useToken } = antdTheme;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = staticMessage.useMessage();
  const { token } = useToken();

  const { events, loading, error, currentPage, totalEvents } = useSelector(
    (state) => state.events
  );
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [bookingInProgressEventId, setBookingInProgressEventId] =
    useState(null);
  const limit = 6;

  useEffect(() => {
    dispatch(fetchEvents({ page, limit }));
  }, [dispatch, page, limit]);

  const handleBookEventFromHome = async (e, eventId) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      messageApi.error("Please log in to book events.");
      navigate("/login");
      return;
    }
    setBookingInProgressEventId(eventId);
    try {
      const resultAction = await dispatch(bookEventTicket(eventId));
      if (bookEventTicket.fulfilled.match(resultAction)) {
        messageApi.success("Event booked successfully!");
        dispatch(fetchEvents({ page, limit }));
        navigate("/congrats");
      } else {
        console.log(
          "[Home.js HBEFH Error] Full resultAction:",
          JSON.parse(JSON.stringify(resultAction))
        );

        const errorPayload = resultAction.payload;
        const actionError = resultAction.error;
        let extractedMessage = "Booking failed due to an unknown error.";

        if (errorPayload) {
          if (typeof errorPayload === "object" && errorPayload.message) {
            extractedMessage = errorPayload.message;
          } else if (
            typeof errorPayload === "string" &&
            errorPayload.trim() !== ""
          ) {
            extractedMessage = errorPayload;
          }
        } else if (actionError && actionError.message) {
          extractedMessage = actionError.message;
        }

        console.log(
          "[Home.js HBEFH Error] Extracted error message for toast:",
          extractedMessage
        );
        messageApi.error(`Booking failed: ${extractedMessage}`);
      }
    } catch (err) {
      console.error("[Home.js HBEFH Catch] Unexpected error:", err);
      messageApi.error("An unexpected error occurred while trying to book.");
    } finally {
      setBookingInProgressEventId(null);
    }
  };

  if (loading && !bookingInProgressEventId && events.length === 0) {
    return (
      <>
        {contextHolder}
        <Spin
          tip="Loading events..."
          size="large"
          style={{ display: "block", marginTop: "50px" }}
        />
      </>
    );
  }

  if (error && events.length === 0) {
    return (
      <>
        {contextHolder}
        <Alert
          message="Error Fetching Events"
          description={
            typeof error === "string"
              ? error
              : error?.message || JSON.stringify(error)
          }
          type="error"
          showIcon
          style={{ marginTop: "20px" }}
        />
      </>
    );
  }

  const bookNowButtonStyle = {
    padding: "0px 25px",
    fontSize: "14px",
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
    borderColor: token.colorPrimary,
    borderWidth: "1px",
    borderStyle: "solid",
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]}>
        {events.map((event) => {
          const isCurrentlyBooking = bookingInProgressEventId === event._id;
          return (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={event._id}>
              <Link
                to={`/event/${event._id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{ background: token.colorBgElevated }}
                  cover={
                    <img
                      alt={event.name}
                      src={
                        event.image ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                  actions={[
                    event.userHasBooked ? (
                      <Tag
                        color="green"
                        style={{
                          padding: "5px 25px",
                          fontSize: "14px",
                          cursor: "default",
                          display: "inline-block",
                        }}
                      >
                        Booked
                      </Tag>
                    ) : (
                      <Button
                        onClick={(e) => handleBookEventFromHome(e, event._id)}
                        loading={isCurrentlyBooking}
                        disabled={isCurrentlyBooking || loading}
                        style={bookNowButtonStyle}
                      >
                        Book Now
                      </Button>
                    ),
                  ]}
                >
                  <Card.Meta
                    title={event.name}
                    description={
                      <>
                        {event.description &&
                          event.description.substring(0, 100) +
                            (event.description.length > 100 ? "..." : "")}
                        {event.description && event.price !== undefined && (
                          <br />
                        )}
                        {event.price !== undefined && (
                          <span
                            style={{
                              fontWeight: "bold",
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            {event.price === 0
                              ? "Free"
                              : `$${Number(event.price).toFixed(2)}`}
                          </span>
                        )}
                      </>
                    }
                  />
                </Card>
              </Link>
            </Col>
          );
        })}
        <Col span={24} style={{ marginTop: "20px", textAlign: "center" }}>
          {totalEvents > 0 && events.length > 0 && (
            <Pagination
              current={currentPage}
              total={totalEvents}
              pageSize={limit}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Home;
