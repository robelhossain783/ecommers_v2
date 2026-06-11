// "use client";

// import { useEffect, useState } from "react";

// interface NotificationBanner {
//   id: number;
//   title?: string;
//   image: string;
//   target_url: string;
// }
// const BASE_URL =
//   // process.env.NEXT_PUBLIC_BASE_URL ||
//   "http://127.0.0.1:8000";

// export default function NotificationBanner() {
//   const [banner, setBanner] = useState<NotificationBanner | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/banner/notification-banner/`
//         );

//         const result = await response.json();

//         if (result?.data) {
//           setBanner(result.data);
//         }
//       } catch (error) {
//         console.error("Banner fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanner();
//   }, []);

//   if (loading || !banner) return null;

//   return (
//     <div className="notification-overlay">
//       <div className="notification-popup">
//         <button
//           className="notification-close"
//           onClick={() => setBanner(null)}
//           aria-label="Close notification"
//         >
//           ✕
//         </button>

//         <a
//           href={banner.target_url}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src={banner.image}
//             alt={banner.title || "Promotion Banner"}
//             className="notification-image"
//           />
//         </a>
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";


const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://127.0.0.1:8000";
export default function NotificationBanner() {
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    const bannerClosed = sessionStorage.getItem(
      "buyfest_banner_closed"
    );

    if (bannerClosed === "true") {
      return;
    }

    fetch(`${BASE_URL}/api/banner/notification-banner/`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setBanner(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(
      "buyfest_banner_closed",
      "true"
    );

    setBanner(null);
  };

  if (!banner) return null;

  return (
    <div className="notification-overlay">
      <div className="notification-popup">
        <button
          className="notification-close"
          onClick={handleClose}
        >
          ✕
        </button>

        <a
          href={banner.target_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={banner.image}
            alt="Promotion"
            className="notification-image"
          />
        </a>
      </div>
    </div>
  );
}