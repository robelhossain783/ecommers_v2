"use client";

import { useEffect, useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://127.0.0.1:8000";

export default function NotificationBanner() {
  const [banner, setBanner] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const bannerClosed = sessionStorage.getItem("buyfest_banner_closed");
    if (bannerClosed === "true") return;

    fetch(`${BASE_URL}/api/banner/notification-banner/`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setTimeout(() => {
            setBanner(data.data);
            setTimeout(() => setVisible(true), 30);
          }, 2500);
        }
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("buyfest_banner_closed", "true");
    setTimeout(() => setBanner(null), 300);
  };

  if (!banner) return null;

  return (
    <>
      <style>{`
        .notification-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .notification-overlay.is-visible {
          opacity: 1;
        }
      `}</style>
      <div className={`notification-overlay${visible ? " is-visible" : ""}`}>
        <div className="notification-popup">
          <button className="notification-close" onClick={handleClose}>✕</button>
          <a href={banner.target_url} target="_blank" rel="noopener noreferrer">
            <img src={banner.image} alt="Promotion" className="notification-image" />
          </a>
        </div>
      </div>
    </>
  );
}
