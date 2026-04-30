# Flowly — Abonelik Takip Sistemi

> Tüm dijital aboneliklerinizi tek yerden yönetin. Gmail ile otomatik keşif, akıllı hatırlatıcılar ve mobil uygulama.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Expo](https://img.shields.io/badge/Expo-53-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/Lisans-MIT-green?style=flat-square)

---

## Özellikler

- **Gmail Tarama** — Fatura e-postalarından aboneliklerinizi otomatik keşfeder
- **Akıllı Otomatik Doldurma** — 200+ popüler servisi tanır; logo, kategori ve fiyat otomatik gelir
- **Mobil Bildirimler** — Yenileme tarihinden 3 gün önce push bildirimi alırsınız
- **Ödendi Akışı** — Bildirime tıklayın, "Ödendi" deyin; sonraki tarih otomatik güncellenir
- **Liquid Glass Tasarım** — Apple WWDC 2025 tarzı modern cam efekti arayüz
- **Ücretsiz Barındırma** — Vercel (web) + Expo Go (mobil) + Neon DB

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Web | Next.js 15 App Router |
| Mobil | Expo 53 (React Native) |
| Veritabanı | Neon PostgreSQL + Drizzle ORM |
| Auth | Clerk |
| Stil | Tailwind CSS v4 + Framer Motion |
| Monorepo | Turborepo + pnpm |

## Kurulum

### Gereksinimler

- Node.js 20+
- pnpm (`npm i -g pnpm`)

### 1. Repoyu klonla

```bash
git clone https://github.com/firatozer01/Flowly.git
cd Flowly
pnpm install
```

### 2. Ortam değişkenlerini ayarla

```bash
cp apps/web/.env.example apps/web/.env.local
```

`apps/web/.env.local` dosyasını düzenle:

| Değişken | Nereden Alınır |
|----------|----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [clerk.com](https://clerk.com) |
| `CLERK_SECRET_KEY` | [clerk.com](https://clerk.com) |
| `DATABASE_URL` | [neon.tech](https://neon.tech) |
| `GOOGLE_CLIENT_ID` | [Google Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google Console |
| `GOOGLE_REDIRECT_URI` | `http://localhost:3000/api/gmail/callback` |
| `CRON_SECRET` | Rastgele güçlü bir şifre |

### 3. Veritabanı tablolarını oluştur

```bash
cd apps/web
pnpm exec drizzle-kit push
```

### 4. Geliştirme sunucusunu başlat

```bash
# Proje kökünde
pnpm dev
```

Web: [http://localhost:3000](http://localhost:3000)

### 5. Mobil uygulamayı başlat

```bash
cd apps/mobile
cp .env.example .env
pnpm start
```

QR kodu [Expo Go](https://expo.dev/go) uygulamasıyla tara.

## Vercel Deploy

1. [vercel.com](https://vercel.com) → **Add New Project** → GitHub repoyu seç
2. **Root Directory** → `apps/web`
3. Environment Variables bölümüne `.env.local` değerlerini gir
4. **Deploy**

Her `git push` sonrasında otomatik deploy alır.

## Proje Yapısı

```
flowly/
├── apps/
│   ├── web/                  # Next.js web uygulaması
│   │   ├── src/app/          # App Router sayfaları & API
│   │   ├── src/components/   # UI bileşenleri
│   │   └── src/lib/          # DB, Gmail tarayıcı, utils
│   └── mobile/               # Expo mobil uygulama
│       ├── app/              # Expo Router ekranları
│       ├── components/       # Native bileşenler
│       └── hooks/            # Push bildirim hook'u
├── packages/
│   ├── shared/               # Ortak tipler
│   └── subscriptions-db/     # 200+ servis veritabanı
└── turbo.json
```

## Lisans

MIT © 2026 [Fırat Özer](https://github.com/firatozer01)
