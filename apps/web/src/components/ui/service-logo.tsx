"use client";

import { useState } from "react";

interface ServiceLogoProps {
  domain: string;
  name: string;
  color: string;
  size?: number;
  className?: string;
}

// Sırayla denenecek logo kaynakları
function sources(domain: string) {
  // apple.com/apple-tv-plus gibi subpath'li domainleri temizle
  const rootDomain = domain.split("/")[0];
  return [
    `https://logo.clearbit.com/${rootDomain}`,
    `https://unavatar.io/${rootDomain}`,
    `https://www.google.com/s2/favicons?domain=${rootDomain}&sz=128`,
  ];
}

export function ServiceLogo({ domain, name, color, size = 40, className }: ServiceLogoProps) {
  const srcs = sources(domain);
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: color + "30",
          border: `1px solid ${color}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size * 0.42,
          color: color,
          flexShrink: 0,
        }}
      >
        {name[0].toUpperCase()}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcs[srcIndex]}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: size * 0.2,
        flexShrink: 0,
      }}
      onError={() => {
        if (srcIndex < srcs.length - 1) {
          setSrcIndex((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
