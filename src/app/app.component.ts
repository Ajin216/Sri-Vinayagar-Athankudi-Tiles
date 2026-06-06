import { Component, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

interface NavLink {
  id: string;
  label: string;
}

interface ProductService {
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

interface GalleryItem {
  title: string;
  imageSrc: string;
  category: string;
}

interface PaymentMethod {
  name: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App implements OnInit, OnDestroy {
  // Navigation
  protected readonly navLinks: NavLink[] = [
    { id: 'home', label: 'Home' },
    { id: 'history', label: 'History' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'location', label: 'Location' },
    { id: 'contact', label: 'Contact' },
  ];

  // Active section for Scroll Spy
  protected readonly activeSection = signal<string>('home');
  // Mobile Menu state
  protected readonly isMobileMenuOpen = signal<boolean>(false);
  // Contact Form Submission status
  protected readonly isSubmitted = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);

  // Hero Carousel State
  protected readonly heroImages: string[] = [
    'images/hero.png',
    'images/hero_2.png',
    'images/hero_3.png'
  ];
  protected readonly currentHeroIndex = signal<number>(0);
  private carouselTimerId: any;

  // Products & Services (7 categories requested)
  protected readonly services: ProductService[] = [
    {
      title: 'Tile Manufacturers',
      description: 'Primary manufacturer of high-grade authentic Athangudi tiles since 1985, maintaining traditional recipes.',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      tags: ['In-house Production', 'Eco-friendly', 'Handmade']
    },
    {
      title: 'Tile Dealers & Distributors',
      description: 'Authorized dealers providing certified heritage tiles across Sivaganga, Palavangudi, and Tamil Nadu.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      tags: ['Retail', 'Sivaganga Network', 'Certified Quality']
    },
    {
      title: 'Athangudi Tile Dealers',
      description: 'Specialized suppliers of authentic custom-designed tiles directly sourced from local Sivaganga artisans.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      tags: ['Custom Designs', 'Heritage Collection', 'Artisan Crafted']
    },
    {
      title: 'Clay Athangudi Tile Dealers',
      description: 'Dealers in traditional eco-friendly clay tiles which act as natural thermal insulators for floors.',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      tags: ['100% Clay', 'Thermal Comfort', 'Rustic Appeal']
    },
    {
      title: 'Tile Wholesalers',
      description: 'Bulk supply of Athangudi tiles for commercial spaces, heritage hotels, and large residential villa projects.',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      tags: ['Bulk Rates', 'Fast Logistics', 'Contract Projects']
    },
    {
      title: 'Floral Athangudi Tile Distributors',
      description: 'Exclusive distributors of intricate, colorful floral patterns. A perfect blend of heritage and aesthetics.',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 8a4 4 0 100 8 4 4 0 000-8z',
      tags: ['Floral Art', 'Hand-poured Patterns', 'Vibrant Shades']
    },
    {
      title: 'Decorative Athangudi Tile Manufacturers',
      description: 'Custom manufacturers creating unique custom border tiles and medallions to match modern interior designs.',
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M9 9h6v6H9V9z',
      tags: ['Bespoke Borders', 'Custom Sizing', 'Luxurious Finish']
    }
  ];

  // Gallery items (mapped to generated local files)
  protected readonly galleryItems: GalleryItem[] = [
    {
      title: 'Classic Floral Raj',
      imageSrc: 'images/tile_floral.png',
      category: 'Floral Design'
    },
    {
      title: 'Traditional Geometric Checker',
      imageSrc: 'images/tile_geometric.png',
      category: 'Geometric'
    },
    {
      title: 'Vibrant Mandala Sun',
      imageSrc: 'images/tile_mandala.png',
      category: 'Mandala Art'
    },
    {
      title: 'Intricate Royal Border',
      imageSrc: 'images/tile_border.png',
      category: 'Bespoke Border'
    },
    {
      title: 'Royal Chettinad Bloom',
      imageSrc: 'images/image5.webp',
      category: 'Floral Design'
    },
    {
      title: 'Vintage Heritage Motif',
      imageSrc: 'images/image6.webp',
      category: 'Mandala Art'
    },
    {
      title: 'Terracotta Mosaic Classic',
      imageSrc: 'images/image7.webp',
      category: 'Geometric'
    },
    {
      title: 'Chettinad Palace Hallway',
      imageSrc: 'images/image8.webp',
      category: 'Bespoke Border'
    }
  ];

  // Payment Methods
  protected readonly paymentMethods: PaymentMethod[] = [
    { name: 'Cash', icon: 'cash', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'UPI', icon: 'upi', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'Net Banking', icon: 'net-banking', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'PhonePe', icon: 'phonepe', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Paytm', icon: 'paytm', colorClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  ];

  // Contact Form Setup
  protected contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z\\s]*$')
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
    this.startHeroCarousel();
  }

  ngOnDestroy(): void {
    this.stopHeroCarousel();
  }

  // Hero Carousel Controls
  protected setHeroIndex(index: number): void {
    this.currentHeroIndex.set(index);
    this.resetHeroCarouselTimer();
  }

  private startHeroCarousel(): void {
    this.carouselTimerId = setInterval(() => {
      this.currentHeroIndex.update(idx => (idx + 1) % this.heroImages.length);
    }, 6000);
  }

  private stopHeroCarousel(): void {
    if (this.carouselTimerId) {
      clearInterval(this.carouselTimerId);
    }
  }

  private resetHeroCarouselTimer(): void {
    this.stopHeroCarousel();
    this.startHeroCarousel();
  }

  // Smooth Scrolling
  protected scrollTo(sectionId: string): void {
    this.closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Mobile Menu Controls
  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // Submit Contact Form
  protected onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValues = this.contactForm.value;
    const messageText = `*New Inquiry from Website*
*Name:* ${formValues.name}
*Phone:* ${formValues.phone}
*Email:* ${formValues.email}
*Message:* ${formValues.message}`;

    const whatsappUrl = `https://wa.me/919207045332?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');

    this.isSubmitting.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.contactForm.reset();
      
      // Auto dismiss success screen after 5 seconds
      setTimeout(() => {
        this.isSubmitted.set(false);
      }, 5000);
    }, 1200);
  }

  // Scroll spy to highlight active header links
  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    const scrollPosition = window.scrollY + 120; // adding sticky header offset

    for (const link of this.navLinks) {
      const element = document.getElementById(link.id);
      if (element) {
        const top = element.offsetTop;
        const height = element.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          this.activeSection.set(link.id);
          break;
        }
      }
    }
  }
}
