import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MIN_CONFIDENCE, ROUTE_MAP } from "../data/scanConstants";
import { scanImage } from "../services/scanService";
import { compressImage } from "../utils/compressImage";
import type { PredictionData } from "../types/scan";

import "./ScanPage.css";

// ───────────────────────── Types ─────────────────────────

type ViewMode = "idle" | "camera" | "preview";
type MessageKind = "error" | "warning";

interface FeedbackMessage {
  text: string;
  kind: MessageKind;
}

// ───────────────────────── Component ─────────────────────────

export default function ScanPage() {
  // ── State ──────────────────────────────────────────────
  const [mode, setMode] = useState<ViewMode>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FeedbackMessage | null>(null);

  // ── Refs ───────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();

  // ── Stop camera helper ─────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Revoke old preview URL when it changes ─────────────
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ──────────────────── Camera handlers ──────────────────

  /** Open the live camera feed. */
  const handleOpenCamera = useCallback(async () => {
    setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");

      // Attach stream to <video> after React renders
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch {
      setMessage({ text: "Không thể truy cập máy ảnh. Vui lòng cho phép quyền camera.", kind: "error" });
    }
  }, []);

  /** Capture a still frame from the live video feed. */
  const handleCaptureFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Stop camera immediately for better UX
    stopCamera();

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const raw = new File([blob], "capture.jpg", { type: "image/jpeg" });
        try {
          const compressed = await compressImage(raw);
          setSelectedFile(compressed);
          setPreviewUrl(URL.createObjectURL(compressed));
        } catch {
          setSelectedFile(raw);
          setPreviewUrl(URL.createObjectURL(raw));
        }
        setMode("preview");
      },
      "image/jpeg",
      0.9,
    );
  }, [stopCamera]);

  // ──────────────────── Gallery handler ──────────────────

  const handleGalleryClick = useCallback(() => {
    setMessage(null);
    galleryInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setMessage(null);

      try {
        const compressed = await compressImage(file);
        setSelectedFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } catch {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
      setMode("preview");

      // Reset input so re-selecting the same file triggers onChange
      e.target.value = "";
    },
    [],
  );

  // ──────────────────── Scan handler ─────────────────────

  const handleScan = useCallback(async () => {
    if (!selectedFile) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setMessage(null);

    try {
      const response = await scanImage(selectedFile, controller.signal);

      if (
        response.status !== "success" ||
        !Array.isArray(response.data) ||
        response.data.length === 0
      ) {
        setMessage({ text: "Không nhận diện được, vui lòng chụp lại", kind: "error" });
        return;
      }

      // Pick highest-confidence prediction
      const sorted = [...response.data].sort(
        (a: PredictionData, b: PredictionData) => b.confidence - a.confidence,
      );
      const best = sorted[0];

      if (best.confidence < MIN_CONFIDENCE) {
        setMessage({ text: "Vui lòng đưa camera lại gần hơn", kind: "warning" });
        return;
      }

      const route = ROUTE_MAP[best.label];
      if (!route) {
        setMessage({ text: "Không nhận diện được, vui lòng chụp lại", kind: "error" });
        return;
      }

      navigate(route);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "CanceledError") return;
      setMessage({ text: "Có lỗi xảy ra, vui lòng thử lại", kind: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedFile, navigate]);

  // ──────────────────── Reset handler ────────────────────

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    stopCamera();
    setPreviewUrl(null);
    setSelectedFile(null);
    setMessage(null);
    setLoading(false);
    setMode("idle");
  }, [stopCamera]);

  // ──────────────────── Render ───────────────────────────

  return (
    <section className="scan-page">
      <h1 className="scan-page__title">Quét Thẻ Gỗ</h1>
      <p className="scan-page__subtitle">
        Chụp ảnh trực tiếp hoặc tải ảnh lên để nhận diện tác phẩm Chạm Việt
      </p>

      {/* Hidden gallery input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="scan-page__file-input"
        onChange={handleFileChange}
      />

      {/* ─── View area ─── */}
      <div className="scan-page__viewport">
        {/* IDLE — placeholder graphic */}
        {mode === "idle" && (
          <div className="scan-page__placeholder">
            <span className="scan-page__camera-icon" aria-hidden>📷</span>
            <span className="scan-page__capture-text">Chọn phương thức bên dưới</span>
            <span className="scan-page__capture-hint">Đặt thẻ gỗ vào giữa khung hình</span>
          </div>
        )}

        {/* CAMERA — live video feed */}
        {mode === "camera" && (
          <video
            ref={videoRef}
            className="scan-page__video"
            autoPlay
            playsInline
            muted
          />
        )}

        {/* PREVIEW — captured / uploaded image */}
        {mode === "preview" && previewUrl && (
          <img src={previewUrl} alt="Ảnh xem trước" className="scan-page__preview" />
        )}
      </div>

      {/* ─── Action buttons ─── */}
      {mode === "idle" && (
        <div className="scan-page__actions">
          <button
            className="scan-page__btn scan-page__btn--primary"
            onClick={handleOpenCamera}
            type="button"
          >
            <span className="scan-page__btn-icon">🎥</span>
            Mở Máy Ảnh
          </button>
          <button
            className="scan-page__btn scan-page__btn--secondary"
            onClick={handleGalleryClick}
            type="button"
          >
            <span className="scan-page__btn-icon">🖼️</span>
            Tải Ảnh Lên
          </button>
        </div>
      )}

      {mode === "camera" && (
        <div className="scan-page__actions scan-page__actions--camera">
          <button
            className="scan-page__btn scan-page__btn--secondary"
            onClick={handleReset}
            type="button"
          >
            Huỷ
          </button>
          <button
            className="scan-page__capture-btn"
            onClick={handleCaptureFrame}
            type="button"
            aria-label="Chụp ảnh"
          >
            <span className="scan-page__capture-ring" />
          </button>
          <button
            className="scan-page__btn scan-page__btn--secondary"
            onClick={handleGalleryClick}
            type="button"
          >
            🖼️
          </button>
        </div>
      )}

      {mode === "preview" && (
        <div className="scan-page__actions">
          <button
            className="scan-page__btn scan-page__btn--secondary"
            onClick={handleReset}
            disabled={loading}
            type="button"
          >
            Chụp Lại
          </button>
          <button
            className="scan-page__btn scan-page__btn--primary"
            onClick={handleScan}
            disabled={loading}
            type="button"
          >
            Nhận Diện
          </button>
        </div>
      )}

      {/* ─── Feedback message ─── */}
      {message && (
        <div className={`scan-page__message scan-page__message--${message.kind}`}>
          {message.text}
        </div>
      )}

      {/* ─── Loading overlay ─── */}
      {loading && (
        <div className="scan-page__overlay" aria-live="assertive">
          <div className="scan-page__spinner" />
          <span className="scan-page__overlay-text">Đang nhận diện...</span>
        </div>
      )}
    </section>
  );
}
