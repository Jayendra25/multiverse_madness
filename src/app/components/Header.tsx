"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import EducationPage from "./MeteorScroll";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Defense System", href: "/DefenseSystem" },
    { name: "Satellite Simulation", href: "/sattelite-simmulation" },
    { name: "About", href: "#about" },
    { name: "Asteroid Launcher", href: "/asteroid-launcher" },
    { name: "Learn ", href: "/learn"}
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-black/20 border-b border-white/10"
          : "backdrop-blur-sm bg-black/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand - Extreme Left */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-white font-bold text-xl sm:text-2xl tracking-tight"
            >
              DEFEND EARTH
            </Link>
          </div>

          {/* Desktop Navigation & CTA - Extreme Right */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-white/90 hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wide group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <button
              onClick={() => scrollTo("EmailAlertRegistration")}
              className="relative px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-full text-white font-medium text-sm uppercase tracking-wide hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              Register for Alerts
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm"></div>
            </button>
          </div>

          {/* Mobile menu button - Right */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-white transition-colors duration-200 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium uppercase tracking-wide text-sm rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <button
                onClick={() => scrollTo("EmailAlertRegistration")}
                className="w-full block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-full text-white font-medium text-sm uppercase tracking-wide hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm text-center"
              >
                Register for Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
