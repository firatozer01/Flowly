"use client";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: "#1a1f3a" }} />

      {/* Orb 1 — mavi-mor */}
      <div className="bg-orb" style={{ width: 650, height: 650, background: "radial-gradient(circle, #6366f1, transparent)", top: "-15%", left: "-8%", animationDelay: "0s" }} />
      {/* Orb 2 — mor */}
      <div className="bg-orb" style={{ width: 550, height: 550, background: "radial-gradient(circle, #a78bfa, transparent)", top: "15%", right: "-5%", animationDelay: "-3s" }} />
      {/* Orb 3 — cyan */}
      <div className="bg-orb" style={{ width: 450, height: 450, background: "radial-gradient(circle, #22d3ee, transparent)", bottom: "-8%", left: "25%", animationDelay: "-6s", opacity: 0.12 }} />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
