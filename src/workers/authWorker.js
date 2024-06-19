self.addEventListener("message", (e) => {
  const { type, key, value } = e.data;

  switch (type) {
    case "save":
      localStorage.setItem(key, JSON.stringify(value));
      self.postMessage({ status: "saved" });
      break;
    case "load":
      const item = localStorage.getItem(key);
      self.postMessage({ status: "loaded", item: JSON.parse(item) });
      break;
    case "delete":
      localStorage.removeItem(key);
      self.postMessage({ status: "deleted" });
      break;
    default:
      self.postMessage({ status: "error", message: "Unknown command" });
  }
});
