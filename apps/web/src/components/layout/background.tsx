"use client";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: "#111214" }} />

      {/* Orb 1 */}
      <div className="bg-orb" style={{ width: 650, height: 650, background: "radial-gradient(circle, #1e2030, transparent)", top: "-15%", left: "-8%", animationDelay: "0s", opacity: 0.6 }} />
      {/* Orb 2 */}
      <div className="bg-orb" style={{ width: 550, height: 550, background: "radial-gradient(circle, #1a1c28, transparent)", top: "15%", right: "-5%", animationDelay: "-3s", opacity: 0.5 }} />
      {/* Orb 3 */}
      <div className="bg-orb" style={{ width: 450, height: 450, background: "radial-gradient(circle, #16181f, transparent)", bottom: "-8%", left: "25%", animationDelay: "-6s", opacity: 0.4 }} />

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
