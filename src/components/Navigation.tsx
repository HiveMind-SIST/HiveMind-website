"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Members", href: "#members" },
  { name: "Gallery", href: "#gallery" },
  { name: "Blogs", href: "#blogs" },
];

const NavBar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  //   useEffect(() => {
  //     gsap.registerPlugin(ScrollTrigger)
  //     const loadGSAP = async () => {

  //       // Initial animation for navbar elements
  //       const tl = gsap.timeline()

  //       tl.fromTo(".nav-logo", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" })
  //         .fromTo(
  //           ".nav-links",
  //           { opacity: 0, y: -20 },
  //           { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
  //           "-=0.4",
  //         )
  //         .fromTo(".nav-login", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")

  //       // Scroll-based show/hide animation
  //       const handleScroll = () => {
  //         const currentScrollY = window.scrollY

  //         if (currentScrollY > 100) {
  //           setIsScrolled(true)
  //         } else {
  //           setIsScrolled(false)
  //         }

  //         if (currentScrollY > lastScrollY && currentScrollY > 100) {
  //           // Scrolling down - hide navbar
  //           if (isVisible) {
  //             setIsVisible(false)
  //             gsap.to(navRef.current, {
  //               y: -100,
  //               duration: 0.3,
  //               ease: "power2.inOut",
  //             })
  //           }
  //         } else {
  //           // Scrolling up - show navbar
  //           if (!isVisible) {
  //             setIsVisible(true)
  //             gsap.to(navRef.current, {
  //               y: 0,
  //               duration: 0.3,
  //               ease: "power2.inOut",
  //             })
  //           }
  //         }

  //         setLastScrollY(currentScrollY)
  //       }

  //       window.addEventListener("scroll", handleScroll, { passive: true })

  //       return () => {
  //         window.removeEventListener("scroll", handleScroll)
  //       }
  //     }

  //     loadGSAP()
  //   }, [isVisible, lastScrollY])

  return (
    <nav ref={navRef}>
      <div className="flex items-center justify-between mx-auto px-8 sm:px-6 lg:px-8 h-16">
        <Link href={"/"} className="flex items-center space-3">
          <Image
            src="/assets/logo.png"
            alt="HiveMind Logo"
            width={32}
            height={32}
            // className="rounded-md"
          />
          <div>HiveMind</div>
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/projects">Projects</Link>
          <Link href="/members">Members</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/blogs">Blogs</Link>
        </div>
        <div>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
    // <nav
    //   ref={navRef}
    //   className={cn(
    //     "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    //     isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : "bg-transparent",
    //   )}
    // >
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="flex items-center justify-between h-16">
    //       {/* Left Division - Logo and Name */}
    //       <div className="flex items-center space-x-3 nav-logo">
    //         <div className="relative w-8 h-8">
    //           <Image
    //             src="/modern-tech-logo.png"
    //             alt="Company Logo"
    //             width={32}
    //             height={32}
    //             className="rounded-md"
    //           />
    //         </div>
    //         <span className="text-xl font-bold text-foreground">TechFlow</span>
    //       </div>

    //       {/* Middle Division - Navigation Links */}
    //       <div className="hidden md:flex items-center space-x-8">
    //         {navLinks.map((link, index) => (
    //           <a
    //             key={link.name}
    //             href={link.href}
    //             className="nav-links text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
    //           >
    //             {link.name}
    //             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
    //           </a>
    //         ))}
    //       </div>

    //       {/* Right Division - Login Button */}
    //       <div className="nav-login">
    //         <Button
    //           variant="default"
    //           size="sm"
    //           className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
    //         >
    //           Login
    //         </Button>
    //       </div>

    //       {/* Mobile Menu Button */}
    //       <div className="md:hidden">
    //         <Button variant="ghost" size="sm">
    //           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    //           </svg>
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default NavBar;
