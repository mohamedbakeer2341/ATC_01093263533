import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider, useSelector } from "react-redux";
import store from "./app/store";
import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";

// Wrapper component to connect ConfigProvider to Redux theme state
const ThemedApp = () => {
  const currentThemeMode = useSelector((state) => state.theme.mode);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentThemeMode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        // You can also customize tokens here for both themes if needed
        // token: {
        //   colorPrimary: '#00b96b',
        // },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);
