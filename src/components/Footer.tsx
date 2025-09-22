"use client"

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Mail, MapPin, User, Images, FolderKanban, FileText } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)
  const logoSectionRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)
  const linksSectionRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLDivElement>(null)
  const copyrightBarRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.set([logoSectionRef.current, contactSectionRef.current, linksSectionRef.current], {
      opacity: 0,
      y: 50
    })

    gsap.set(copyrightBarRef.current, {
        width: 0
    })
    
    gsap.set(copyrightRef.current, {
      opacity: 0,
      y: 30
    })

    gsap.set(footerRef.current, {
      scale: 0.95
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        end: "bottom 60%",
        toggleActions: "play none none reverse",
      }
    })

    tl.to(footerRef.current, {
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    })
    .to([logoSectionRef.current, contactSectionRef.current, linksSectionRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2
    }, "-=0.6")
    .to(copyrightRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(copyrightBarRef.current, {
        width: "100%",
        ease: "power2.out",
        duration: 1,
        delay: 0.2
    })

    // Logo Pulse Animation
    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })

    if (logoSectionRef.current) {
      const socialLinks = logoSectionRef.current.querySelectorAll('a[href*="github"], a[href*="linkedin"], a[href*="discord"], a[href*="instagram"]')
      
      gsap.fromTo(socialLinks, {
        opacity: 0,
        x: -20
      }, {
        opacity: 1,
        x: 0,
        delay: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: logoSectionRef.current,
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none reverse"
        }
      })
    }

    if (linksSectionRef.current) {
      const quickLinks = linksSectionRef.current.querySelectorAll('a[href^="/"]')
      
      gsap.fromTo(quickLinks, {
        opacity: 0,
        x: 20
      }, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: linksSectionRef.current,
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none reverse"
        }
      })
    }

    gsap.to(footerRef.current, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }

  }, [])

  const handleLinkHover = (element: HTMLElement, isEntering: boolean) => {
    gsap.to(element, {
      scale: isEntering ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleLogoHover = (isEntering: boolean) => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotation: isEntering ? 5 : 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  return (
    <footer ref={footerRef} className='py-8 px-4 md:px-8 lg:px-32'>
        <div className='flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 gap-6'>
            <div ref={logoSectionRef} className='space-y-3'>
                <Link 
                  href="/" 
                  className='flex items-center space-x-2'
                  onMouseEnter={() => handleLogoHover(true)}
                  onMouseLeave={() => handleLogoHover(false)}
                >
                    <div ref={logoRef}>
                        <Image src="/assets/logo.png" alt="Hive Mind Logo" width={64} height={64} />
                    </div>
                    <h2 className='text-xl md:text-2xl font-bold'>Hive Mind</h2>
                </Link>
                <p className='text-sm md:text-base'>Empowering the next generation of AI innovators</p>
                <div className='flex flex-col space-y-1'>
                    <Link 
                      href="https://github.hivemind-sist.tech" 
                      className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2' 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                      onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>GitHub</span>
                    </Link>
                    <Link 
                      href="https://linkedin.hivemind-sist.tech" 
                      className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2' 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                      onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span>LinkedIn</span>
                    </Link>
                    <Link 
                      href="https://discord.hivemind-sist.tech" 
                      className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2' 
                      target="_blank" 
                      rel="noopener noreferrer nofollow"
                      onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                      onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 14.09 14.09 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.373.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                        </svg>
                        <span>Discord</span>
                    </Link>
                    <Link 
                      href="https://instagram.hivemind-sist.tech" 
                      className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2' 
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                      onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>Instagram</span>
                    </Link>
                </div>
            </div>
            <div ref={contactSectionRef} className='flex flex-col space-y-2'>
                <h3 className='text-lg md:text-xl text-primary font-bold'>Contact</h3>
                <div className='text-sm md:text-base'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a 
                                href="https://maps.app.goo.gl/B5N5FzdHVRtFbezX7"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className='not-italic cursor-pointer hover:text-primary transition-colors duration-200 no-underline flex items-start space-x-2'
                                onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                                onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                            >
                                <MapPin size={16} className='mt-0.5 flex-shrink-0 text-primary' />
                                <address className='not-italic'>
                                    AI Supercomputing Lab - SCAS Block,<br />
                                    Sathyabama Institute of Science and Technology,<br />
                                    Chennai (Sholinganallur Campus)
                                </address>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="p-2 bg-background border border-border shadow-lg max-w-none">
                            <div className="w-[600px] h-[450px] max-w-[90vw] max-h-[50vh]">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1030.2133297839964!2d80.22496070198066!3d12.871198788122003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b0e1618d76d%3A0xc5be1e1462ec6d0d!2sSathyabama%20Centre%20for%20Advanced%20Studies!5e0!3m2!1sen!2sin!4v1758476903112!5m2!1sen!2sin" 
                                    width="100%" 
                                    height="100%" 
                                    style={{border: 0}} 
                                    allowFullScreen 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Sathyabama Centre for Advanced Studies Location"
                                />
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <a 
                  href="mailto:admin@hivemind-sist.tech" 
                  className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2'
                  onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                >
                    <Mail size={16} className='text-primary' />
                    <span>admin@hivemind-sist.tech</span>
                </a>
            </div>
            <div ref={linksSectionRef} className='flex flex-col space-y-2'>
                <h3 className='text-lg md:text-xl text-primary font-bold'>Quick Links</h3>
                <div className='flex flex-col space-y-1'>
                <Link 
                  href="/projects" 
                  className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2'
                  onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                >
                    <FolderKanban size={16} className='text-primary' />
                    <span>Projects</span>
                </Link>
                <Link 
                  href="/members" 
                  className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2'
                  onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                >
                    <User size={16} className='text-primary' />
                    <span>Members</span>
                </Link>
                <Link 
                  href="/gallery" 
                  className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2'
                  onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                >
                    <Images size={16} className='text-primary' />
                    <span>Gallery</span>
                </Link>
                <Link 
                  href="/blogs" 
                  className='text-sm md:text-base hover:text-primary transition-colors duration-200 flex items-center space-x-2'
                  onMouseEnter={(e) => handleLinkHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleLinkHover(e.currentTarget, false)}
                >
                    <FileText size={16} className='text-primary' />
                    <span>Blogs</span>
                </Link>
                </div>
            </div>
        </div>
        <div className='flex mt-8 justify-center'>
            <div ref={copyrightBarRef} className="border-t border-primary"></div>
        </div>
        <div ref={copyrightRef} className='text-center pt-4'>
            <p className='text-xs md:text-sm'>© 2025 Hive Mind Community. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer