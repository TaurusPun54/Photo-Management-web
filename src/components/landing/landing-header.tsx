"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isScrolled ? "text-foreground" : "text-white"}`}>Photo App</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="#features"
              className={`${
                isScrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
              } transition-colors`}
            >
              Features
            </Link>
            <Link
              href="#"
              className={`${
                isScrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
              } transition-colors`}
            >
              Pricing
            </Link>
            <Link
              href="#"
              className={`${
                isScrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
              } transition-colors`}
            >
              FAQ
            </Link>
            <div className="ml-4 flex items-center space-x-2">
              <Button
                variant={isScrolled ? "outline" : "ghost"}
                className={isScrolled ? "" : "text-white border-white hover:bg-white/20"}
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className={isScrolled ? "" : "bg-white text-black hover:bg-white/90"} asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="#features"
              className="block text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#"
              className="block text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="block text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
