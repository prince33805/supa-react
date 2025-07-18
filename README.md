# 🛍️ Supa React

A modern, responsive e-commerce web app built with **Next.js App Router**, **Supabase**, **Tailwind CSS**, and **TypeScript**. Includes features like product listing, shopping cart, authentication, and order history.

## 🚀 Demo

🔗 Live Demo: [https://supa-react-ashy.vercel.app](https://supa-react-ashy.vercel.app)

## 🧰 Tech Stack

- 🧠 **Next.js (App Router)**
- 🧾 **Supabase** (Postgres DB, Auth, Storage, Edge Functions)
- 💳 **Omise API** (PromptPay QR Payment)
- 🧩 **TypeScript**, **Tailwind CSS**, **Shadcn UI**

## 📦 Features

- ✅ User authentication (login/register with Supabase Auth)
- 🛍️ Product listing and details
- 🛒 Cart with quantity & remove controls
- 💸 PromptPay payment via Omise API
- 🧾 Order history and export as pdf and csv
- 🔐 Middleware auth guard
- ⚙️ Modular route structure with App Router
- ⚡ Fast, responsive UI with Tailwind

## ⚡ Supabase Edge Function + Omise

This project uses **Supabase Edge Functions** to securely interact with the **Omise API**.

## 🛠️ Getting Started Local Dev
```bash
1. **Clone the repo**
   ```bash
   git clone https://github.com/prince33805/supa-react.git
   cd supa-react
2. Install dependencies
    npm install
3. Set up environment
    cp .env.example .env.local
    add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Run locally
    npm run dev