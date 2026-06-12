"use client";
import { useEffect, useRef, useState } from "react";

// ─── Page Loader ──────────────────────────────────────────────────────────────
function PageLoader() {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 1000);
    const t2 = setTimeout(() => setGone(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (gone) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#FDF6F0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, opacity: hiding ? 0 : 1, transition: "opacity 0.7s ease", pointerEvents: hiding ? "none" : "all" }}>
      <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: 56, color: "#1C0A2B", lineHeight: 1 }}>NasCakes</span>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#F2C4CE", animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
      </div>
      <style>{`@keyframes dot{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}

// ─── Fade In ──────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}ms,transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photos, index, onClose }: { photos: string[]; index: number; onClose: () => void }) {
  const [cur, setCur] = useState(index);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCur(c => (c + 1) % photos.length);
      if (e.key === "ArrowLeft") setCur(c => (c - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", h);
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, photos.length]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(28,10,43,0.95)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#FDF6F0", fontSize: 40, cursor: "pointer", lineHeight: 1, opacity: .7 }}>&times;</button>
      <button onClick={e => { e.stopPropagation(); setCur(c => (c - 1 + photos.length) % photos.length); }} style={{ position: "absolute", left: 12, background: "rgba(253,246,240,0.08)", border: "1px solid rgba(253,246,240,0.15)", color: "#FDF6F0", borderRadius: "50%", width: 46, height: 46, cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>&#8249;</button>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: "88vw", maxHeight: "90vh" }}>
        <img src={`/photos/${photos[cur]}`} alt="Cake" style={{ maxWidth: "88vw", maxHeight: "86vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 32px 80px rgba(0,0,0,0.6)", display: "block" }} />
      </div>
      <button onClick={e => { e.stopPropagation(); setCur(c => (c + 1) % photos.length); }} style={{ position: "absolute", right: 12, background: "rgba(253,246,240,0.08)", border: "1px solid rgba(253,246,240,0.15)", color: "#FDF6F0", borderRadius: "50%", width: 46, height: 46, cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>&#8250;</button>
      <p style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", color: "rgba(253,246,240,0.35)", fontSize: 13, margin: 0, letterSpacing: "0.08em" }}>{cur + 1} / {photos.length}</p>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  "photo_0.jpg", "photo_1.jpg", "photo_2.jpg", "photo_3.jpg", "photo_4.jpg",
  "photo_5.jpg", "photo_6.jpg", "photo_7.jpg", "photo_8.jpg", "photo_9.jpg",
  "photo_10.jpg", "photo_11.jpg", "photo_12.jpg", "photo_13.jpg", "photo_14.jpg",
  // "photo_15.jpg", "photo_16.jpg", "photo_17.jpg", "photo_18.jpg", "photo_19.jpg",
  // "photo_20.jpg", "photo_21.jpg", "photo_22.jpg", "photo_23.jpg", "photo_24.jpg",
  // "photo_25.jpg", "photo_26.jpg", "photo_27.jpg", "photo_28.jpg", "photo_29.jpg",
  // "photo_30.jpg", "photo_31.jpg", "photo_32.jpg", "photo_33.jpg", "photo_34.jpg",
  // "photo_35.jpg", "photo_36.jpg", "photo_37.jpg", "photo_38.jpg", "photo_39.jpg",
  // "photo_40.jpg", "photo_41.jpg", "photo_42.jpg",
];

const CAKE_TYPES = [
  { label: "Birthday Cakes", desc: "Single and multi-tier, made to match your vision." },
  { label: "Wedding and Anniversary Cakes", desc: "Romantic designs for the moments that matter most." },
  { label: "Baby Shower Cakes", desc: "Sweet, soft designs to welcome a new arrival." },
  { label: "Flavoured Specialty Cakes", desc: "Rasmalai, chocolate, and seasonal favourites." },
  { label: "Custom Designs", desc: "Send me a reference and I will bring it to life." },
];

const FAQS = [
  { q: "How do I place an order?", a: "Send me a DM on Instagram or message me on WhatsApp. Tell me the occasion, the date, and how many people it is for. I will reply with a design idea and a price." },
  { q: "How much notice do you need?", a: "At least 3 to 5 days for most orders. For large or very detailed cakes, a week or more is better. The earlier you ask, the more time we have to get the design just right." },
  { q: "What flavours do you offer?", a: "Chocolate, vanilla, butterscotch, Rasmalai, and a few seasonal specials. If you have something specific in mind, just ask and I will let you know if it is possible." },
  { q: "Do you deliver?", a: "Pickup is from East Burdwan. For delivery within a short distance, message me and we can arrange something depending on where you are." },
  { q: "Can I send a reference photo?", a: "Yes, absolutely. Send me any photo you like and I will tell you how closely I can match it and what it would cost." },
  { q: "How much does a cake cost?", a: "Every cake is priced individually because each one is different. DM me with your requirements and I will give you an honest price right away." },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(28,10,43,0.1)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 16, textAlign: "left" }}
      >
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: "#1C0A2B", fontWeight: 500, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "#C9964A", fontSize: 22, lineHeight: 1, flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease" }}>+</span>
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? 200 : 0, transition: "max-height 0.35s ease", paddingBottom: open ? 20 : 0 }}>
        <p style={{ fontSize: 14, color: "#7A6070", lineHeight: 1.8, margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

// ─── WhatsApp Button ──────────────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/91XXXXXXXXXX?text=Hi%20NasCakes!%20I%20would%20like%20to%20order%20a%20cake."
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(37,211,102,0.55)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)"; }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const WHATSAPP = "https://wa.me/91XXXXXXXXXX?text=Hi%20NasCakes!%20I%20would%20like%20to%20order%20a%20cake.";
  const INSTAGRAM = "https://www.instagram.com/nascakesbakery";

  return (
    <main style={{ background: "#FDF6F0", fontFamily: "'DM Sans',sans-serif", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{margin:0;}
        ::selection{background:#F2C4CE;color:#1C0A2B;}
        .nav-link{color:#7A6070;text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s;}
        .nav-link:hover{color:#1C0A2B;}
        .gimg{transition:transform 0.45s ease;display:block;width:100%;}
        .gimg:hover{transform:scale(1.04);}
        .gcell{break-inside:avoid;margin-bottom:10px;border-radius:12px;overflow:hidden;cursor:zoom-in;}
        .gallery-grid{columns:2;column-gap:10px;}
        @media(min-width:600px){.gallery-grid{columns:3;}}
        @media(min-width:900px){.gallery-grid{columns:4;}}
        /* Hero split layout */
        .hero-inner{display:flex;flex-direction:column;min-height:100svh;position:relative;}
        @media(min-width:768px){
          .hero-inner{flex-direction:row;align-items:stretch;}
          .hero-text-col{width:52%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 56px 72px;}
          .hero-img-col{width:48%;position:relative;overflow:hidden;}
        }
        /* Mobile nav hidden links */
        @media(max-width:767px){
          .desktop-nav-links{display:none!important;}
          .desktop-nav-cta{display:none!important;}
        }

        @media(min-width:768px){.mobile-menu-btn{display:none!important;}}
@media(max-width:767px){.desktop-nav-cta{display:none!important;} .desktop-nav-links{display:none!important;}}



@media(min-width:768px){
  .hero-text-col{
    background: none;
    z-index: 3;
  }
  .hero-img-col{ background: transparent; }
  .hero-bg-img{
    object-position: 60% center;
    transform: scale(1.04);
  }
  .hero-bg-overlay{
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 25% 40%, rgba(28,10,43,0.35), transparent 32%), linear-gradient(to right, rgba(28,10,43,0.55) 0%, rgba(28,10,43,0.12) 40%, transparent 100%);
    z-index: 1;
    pointer-events: none;
  }
}
.hero-inner{ background: #1C0A2B; }



@media(max-width:767px){
  .hero-inner{ background: #1C0A2B; }
  .hero-img-col{ min-height: 300px; opacity: 0.5; }
  .hero-bg-img{
    object-position: 50% center;
    transform: scale(1.02);
  }
`}</style>
      <PageLoader />

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "rgba(253,246,240,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(242,196,206,0.3)" }}>
        <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: 30, color: "#1C0A2B", lineHeight: 1 }}><a href="/" style={{ color: "#1C0A2B", textDecoration: "none" }}>NasCakes</a></span>

        {/* Center nav links - hidden on mobile */}
        <div style={{ display: "flex", gap: 32, position: "absolute", left: "50%", transform: "translateX(-50%)" }} className="desktop-nav-links">
          <a href="#gallery" className="nav-link">Gallery</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#order" className="nav-link">Order</a>
        </div>

        {/* Right side - CTA hidden on mobile, hamburger hidden on desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="desktop-nav-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#1C0A2B", color: "#FDF6F0", borderRadius: 999, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
            Order via Instagram
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            {/* <svg width="24" height="24" fill="none" stroke="#1C0A2B" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg> */}

            <svg width="24" height="24" fill="none" stroke="#1C0A2B" strokeWidth="1.8" viewBox="0 0 24 24">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 35, background: "#FDF6F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
          {["#gallery", "#about", "#faq", "#order"].map((href, i) => (
            <a key={href} href={href} style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: "#1C0A2B", textDecoration: "none" }}>
              {["Gallery", "About", "FAQ", "Order"][i]}
            </a>
          ))}
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8, padding: "14px 36px", background: "#1C0A2B", color: "#FDF6F0", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
            Order via Instagram
          </a>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 0, background: "#1C0A2B", position: "relative", overflow: "hidden" }}>
        <div className="hero-inner">

          {/* Left: text col (mobile: bottom overlay) */}
          <div className="hero-text-col" style={{ padding: "300px 24px 56px", position: "relative", zIndex: 2 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F2C4CE", marginBottom: 14, fontWeight: 500 }}>East Burdwan, West Bengal</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,7vw,68px)", lineHeight: 1.05, fontStyle: "italic", fontWeight: 400, color: "#FDF6F0", marginBottom: 20 }}>
              Made with passion,<br /><span style={{ color: "#F2C4CE" }}>baked for you.</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(253,246,240,0.7)", fontWeight: 300, lineHeight: 1.8, marginBottom: 36, maxWidth: 420 }}>
              Custom cakes for birthdays, weddings, baby showers, and every sweet occasion in between. Each one baked to order, designed just for you.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#gallery" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", background: "#F2C4CE", color: "#1C0A2B", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                Browse the Gallery
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "rgba(255,255,255,0.1)", color: "#FDF6F0", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, fontSize: 14, textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
            </div>
          </div>

          <img
            className="hero-bg-img"
            src="/photos/founder.jpg"
            alt="Founder at NasCakes"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
              // objectPosition: "50% bottom",
              zIndex: 0
            }}
          />
          <div className="hero-bg-overlay" />
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "center" }}>
          <FadeIn>
            <div style={{ position: "relative" }}>
              <img src="/photos/photo_3.jpg" alt="A beautiful cake" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: -20, right: -20, width: 110, height: 110, borderRadius: "50%", background: "#F2C4CE", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, color: "#1C0A2B", margin: 0 }}>168</p>
                  <p style={{ fontSize: 11, color: "#7A6070", margin: 0 }}>Cakes made</p>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9964A", marginBottom: 14 }}>The Story</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#1C0A2B", lineHeight: 1.2, marginBottom: 20 }}>
                Not a professional.<br /><em>A passionate baker.</em>
              </h2>
              <p style={{ fontSize: 15, color: "#7A6070", lineHeight: 1.85, marginBottom: 16 }}>
                Every cake that leaves my kitchen carries a little piece of me. I am not a chain bakery or a commercial kitchen. I am someone who genuinely loves what baking does for people.
              </p>
              <p style={{ fontSize: 15, color: "#7A6070", lineHeight: 1.85, marginBottom: 28 }}>
                Based in East Burdwan, I take orders for celebrations big and small. Every cake is made fresh, baked to order, and designed around exactly what you have in mind.
              </p>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: "#1C0A2B", textDecoration: "none" }}>
                Follow along on Instagram
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ background: "#FFFAF8", padding: "80px 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9964A", marginBottom: 12 }}>The Work</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,46px)", fontWeight: 400, fontStyle: "italic", color: "#1C0A2B", margin: 0 }}>Every cake, a little story.</h2>
            </div>
          </FadeIn>
          <div className="gallery-grid">
            {GALLERY_PHOTOS.map((photo, i) => (
              <FadeIn key={photo} delay={Math.min(i * 25, 250)}>
                <div className="gcell" onClick={() => setLightboxIndex(i)}>
                  <img src={`/photos/${photo}`} alt={`NasCakes creation ${i + 1}`} className="gimg" loading={i < 8 ? "eager" : "lazy"} />
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#1C0A2B", color: "#FDF6F0", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                See more on Instagram
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── What I Make ───────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9964A", marginBottom: 12 }}>What I Make</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 400, color: "#1C0A2B", marginBottom: 40 }}>There is a cake for every moment.</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {CAKE_TYPES.map((type, i) => (
              <FadeIn key={type.label} delay={i * 70}>
                <div style={{ borderRadius: 16, padding: "28px 24px", background: i % 2 === 0 ? "#F2C4CE" : "#1C0A2B" }}>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 500, color: i % 2 === 0 ? "#1C0A2B" : "#FDF6F0", marginBottom: 8 }}>{type.label}</p>
                  <p style={{ fontSize: 14, color: i % 2 === 0 ? "#7A6070" : "rgba(253,246,240,0.65)", lineHeight: 1.7, margin: 0 }}>{type.desc}</p>
                </div>
              </FadeIn>
            ))}
            <FadeIn delay={400}>
              <div style={{ borderRadius: 16, padding: "28px 24px", background: "#C9964A" }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 500, color: "#FDF6F0", marginBottom: 8 }}>Not sure what you need?</p>
                <p style={{ fontSize: 14, color: "rgba(253,246,240,0.85)", lineHeight: 1.7, marginBottom: 16 }}>Tell me about your occasion and I will help you figure it out.</p>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#FDF6F0", textDecoration: "underline", textUnderlineOffset: 3 }}>Message me on Instagram</a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: "#FFFAF8", padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9964A", marginBottom: 12 }}>Questions</p>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 400, color: "#1C0A2B", margin: 0 }}>Things people ask me.</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ borderTop: "1px solid rgba(28,10,43,0.1)" }}>
              {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <p style={{ textAlign: "center", fontSize: 14, color: "#7A6070", marginTop: 36, lineHeight: 1.7 }}>
              Still have a question?{" "}
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: "#1C0A2B", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>Send me a WhatsApp</a>{" "}
              or{" "}
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ color: "#1C0A2B", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>DM on Instagram.</a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── How to Order ──────────────────────────────────────────────────── */}
      <section id="order" style={{ background: "#1C0A2B", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F2C4CE", marginBottom: 12 }}>How to Order</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,46px)", fontWeight: 400, fontStyle: "italic", color: "#FDF6F0", marginBottom: 12 }}>Simple. Just send a message.</h2>
            <p style={{ fontSize: 15, color: "rgba(253,246,240,0.6)", lineHeight: 1.8, marginBottom: 52, maxWidth: 500 }}>All orders start with a quick message. Here is what happens next.</p>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 52 }}>
            {[
              { step: "01", title: "Send a message", body: "WhatsApp or Instagram DM. Tell me the occasion, the date, how many people, and any ideas you have." },
              { step: "02", title: "We talk it through", body: "I will reply with a design idea and a price. No obligation, just a friendly conversation." },
              { step: "03", title: "Your cake is made", body: "Once confirmed, I bake everything fresh to order. Pickup from East Burdwan." },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 100}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 500, color: "rgba(242,196,206,0.18)", lineHeight: 1, marginBottom: 12 }}>{item.step}</p>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#FDF6F0", marginBottom: 10 }}>{item.title}</p>
                  <p style={{ fontSize: 14, color: "rgba(253,246,240,0.5)", lineHeight: 1.8, margin: 0 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={300}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#25D366", color: "#fff", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp me
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "rgba(255,255,255,0)", border: "1px solid rgba(242,196,206,0.3)", color: "rgba(253,246,240,0.75)", borderRadius: 999, fontSize: 14, textDecoration: "none" }}>
                DM on Instagram
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#1C0A2B", borderTop: "1px solid rgba(242,196,206,0.08)", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Great Vibes',cursive", fontSize: 28, color: "rgba(253,246,240,0.4)" }}>NasCakes</span>
        <p style={{ fontSize: 12, color: "rgba(253,246,240,0.25)", margin: 0, textAlign: "center" }}>East Burdwan, West Bengal. All cakes made fresh to order.</p>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "rgba(253,246,240,0.3)", textDecoration: "none" }}>@nascakesbakery</a>


        <p style={{ width: "100%", textAlign: "center", fontSize: 12, color: "rgba(253,246,240,0.45)", margin: "12px 0 0", borderTop: "1px solid rgba(242,196,206,0.08)", paddingTop: 14, letterSpacing: "0.05em" }}>
          Powered by <a href="https://digistreamline.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(242,196,206,0.6)", textDecoration: "none", fontWeight: 500 }}>DigiStreamline</a>
        </p>

      </footer>

      {/* ── WhatsApp floating button ──────────────────────────────────────── */}
      <WhatsAppButton />

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox photos={GALLERY_PHOTOS} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </main>
  );
}
