import { useCallback, useEffect, useRef, useState } from "react";

export function useCamera({ onSample, sampleIntervalMs }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const sampleTimer = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
      setError(null);
    } catch (err) {
      setError("camera_unavailable");
      setIsStreaming(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    setIsStreaming(false);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  }, []);

  useEffect(() => {
    if (!isStreaming || !onSample) return undefined;
    if (sampleTimer.current) clearInterval(sampleTimer.current);
    sampleTimer.current = setInterval(() => {
      const frame = captureFrame();
      if (frame) onSample(frame);
    }, sampleIntervalMs || 900);

    return () => {
      if (sampleTimer.current) clearInterval(sampleTimer.current);
    };
  }, [isStreaming, onSample, sampleIntervalMs, captureFrame]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
