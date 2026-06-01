// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { bannerSlides } from "@/data";

// export default function HeroBanner() {
//   const [active, setActive] = useState(0);
//   // Todo- fetch hero banner from api, and update the bannerSlides array

//   // api response:  [
//   //   {
//   //     "id": 1,
//   //     "title": "New Season Gadgets",
//   //     "subtitle": "Best deals on tech products",
//   //     "image": "https://res.cloudinary.com/xxx/image/upload/abc.jpg",
//   //     "cta": "Shop Now",
//   //     "href": "/shop",
//   //     "accentColor": "#ff4d4d"
//   //   }
//   // ]

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActive((prev) => (prev + 1) % bannerSlides.length);
//     }, 4500);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="hero-section container">
//       <div
//         style={{
//           position: "relative",
//           height: "420px",
//           borderRadius: "12px",
//           overflow: "hidden",
//         }}
//       >
//         {bannerSlides.map((slide, i) => (
//           <div
//             key={slide.id}
//             style={{
//               position: "absolute",
//               inset: 0,
//               opacity: i === active ? 1 : 0,
//               transition: "opacity 0.7s ease",
//             }}
//           >
//             {/* IMAGE */}
//             <Image
//               src={slide.image}
//               alt={slide.title}
//               fill
//               style={{ objectFit: "cover" }}
//               priority
//             />

//             {/* OVERLAY */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 background: "rgba(0,0,0,0.45)",
//               }}
//             />

//             {/* CONTENT */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "60px",
//                 transform: "translateY(-50%)",
//                 color: "#fff",
//               }}
//             >
//               <span style={{ color: slide.accentColor, fontWeight: 600 }}>
//                 🔥 Latest Arrivals
//               </span>

//               <h2 style={{ fontSize: 44, margin: "10px 0" }}>
//                 {slide.title}
//               </h2>

//               <p style={{ opacity: 0.85 }}>{slide.subtitle}</p>

//               <a
//                 href={slide.href}
//                 style={{
//                   display: "inline-block",
//                   marginTop: 15,
//                   padding: "10px 18px",
//                   background: slide.accentColor,
//                   color: "#fff",
//                   borderRadius: 6,
//                   textDecoration: "none",
//                 }}
//               >
//                 {slide.cta} →
//               </a>
//             </div>
//           </div>
//         ))}

//         {/* DOTS */}
//         <div
//           style={{
//             position: "absolute",
//             bottom: 15,
//             width: "100%",
//             display: "flex",
//             justifyContent: "center",
//             gap: 8,
//           }}
//         >
//           {bannerSlides.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setActive(i)}
//               style={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: "50%",
//                 border: "none",
//                 background: i === active ? "#fff" : "rgba(255,255,255,0.4)",
//                 cursor: "pointer",
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://127.0.0.1:8000";


export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [bannerSlides, setBannerSlides] = useState([]);


  // FETCH API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/banner/list/`);
        const data = await res.json();
        setBannerSlides(data);
      } catch (error) {
        console.log("Banner fetch error:", error);
      }
    };

    fetchBanners();
  }, []);

  // auto slide
  useEffect(() => {
    if (bannerSlides.length === 0) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [bannerSlides]);

  if (bannerSlides.length === 0) {
    return (
      <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading banners...
      </div>
    );
  }

  return (
    <section className="hero-section container">
      <div
        style={{
          position: "relative",
          height: "420px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {bannerSlides.map((slide, i) => (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.7s ease",
            }}
          >
            {/* IMAGE */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />

            {/* OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
              }}
            />

            {/* CONTENT */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "60px",
                transform: "translateY(-50%)",
                color: "#fff",
              }}
            >
              <span style={{ color: slide.accentColor, fontWeight: 600 }}>
                🔥 Latest Arrivals
              </span>

              <h2 style={{ fontSize: 44, margin: "10px 0" }}>
                {slide.title}
              </h2>

              <p style={{ opacity: 0.85 }}>{slide.subtitle}</p>

              <a
                href={slide.href}
                style={{
                  display: "inline-block",
                  marginTop: 15,
                  padding: "10px 18px",
                  background: slide.accentColor,
                  color: "#fff",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                {slide.cta} →
              </a>
            </div>
          </div>
        ))}

        {/* DOTS */}
        <div
          style={{
            position: "absolute",
            bottom: 15,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "none",
                background: i === active ? "#fff" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}