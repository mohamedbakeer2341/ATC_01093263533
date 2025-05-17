import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const Congrats = () => {
  return (
    <Result
      status="success"
      title="Booking Successful!"
      subTitle="You have successfully booked your ticket for the event. We look forward to seeing you!"
      extra={[
        <Link to="/" key="home">
          <Button type="primary">Go to Homepage</Button>
        </Link>,
      ]}
      style={{ marginTop: "50px" }}
    />
  );
};

export default Congrats;
