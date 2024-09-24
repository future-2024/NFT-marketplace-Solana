"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";

// Dynamically load WalletMultiButton to ensure it is only rendered on the client side
const DynamicWalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/api/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch(() => {
          setUsername(null);
        });
    }
  }, []);

  const handleToggleTheme = () => {
    toggleTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-black p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          {/* <Image
            src="/assets/BujeyBrandLogo03.png"
            alt="Bujey Brand Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          /> */}
          <div className="text-white text-xl font-bold">Defy</div>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/dashboard" className="text-white hidden sm:inline">
            Profile
          </Link>
          <Link href="/studio" className="text-white hidden sm:inline">
            Studio
          </Link>
          <Link href="/discover" className="text-white hidden sm:inline">
            Discover
          </Link>
          <Link href="/discover/closet" className="text-white hidden sm:inline">
            Closet
          </Link>
          <Link href="/marketplace" className="text-white hidden sm:inline">
            Market
          </Link>
          <button
            onClick={handleToggleTheme}
            className="bg-black text-white px-2 py-1 rounded flex items-center justify-center"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-white" />
            ) : (
              <Sun className="w-5 h-5 text-white" />
            )}
          </button>
          <DynamicWalletMultiButton />
        </div>
      </div>
      <div className="container mx-auto flex justify-between items-center sm:hidden mt-2">
        <Link href="/dashboard" className="text-white">
          Profile
        </Link>
        <Link href="/studio" className="text-white">
          Studio
        </Link>
        <Link href="/discover" className="text-white">
          Discover
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
