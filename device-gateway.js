(() => {
  // Keep backend or ESP32-bridge transport details inside the injected adapter.
  const requiredMethods = [
    "getConnectionStatus",
    "getSensorReadings",
    "sendControlCommand"
  ];

  const create = (adapter) => {
    if (!adapter || requiredMethods.some((method) => typeof adapter[method] !== "function")) {
      throw new TypeError("The device adapter must implement the connectivity, readings, and control methods.");
    }

    return Object.freeze({
      getConnectionStatus: (...args) => adapter.getConnectionStatus(...args),
      getSensorReadings: (...args) => adapter.getSensorReadings(...args),
      sendControlCommand: (...args) => adapter.sendControlCommand(...args)
    });
  };

  window.SUQIADeviceGateway = Object.freeze({ create });
})();
