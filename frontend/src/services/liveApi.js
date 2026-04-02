const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";

export async function inferFrame(dataUrl) {
  const response = await fetch(`${API_BASE}/api/infer/frame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jpeg_b64: dataUrl.split(",")[1] }),
  });
  if (!response.ok) {
    throw new Error("frame_infer_failed");
  }
  return response.json();
}

export function createLiveSocket({ onInference, onOpen, onClose }) {
  const socket = new WebSocket(`${WS_BASE}/ws/live-scan`);
  socket.onopen = () => onOpen?.();
  socket.onclose = () => onClose?.();
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "inference") onInference?.(data);
    } catch {
      return;
    }
  };
  return socket;
}

export async function requestGradcam(imageId) {
  const response = await fetch(`${API_BASE}/api/infer/gradcam`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_id: imageId }),
  });
  return response.json();
}

export async function chatAdvice(payload) {
  const response = await fetch(`${API_BASE}/api/chat/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("chat_failed");
  }
  return response.json();
}
