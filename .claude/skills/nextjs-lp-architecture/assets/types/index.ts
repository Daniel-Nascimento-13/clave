// Barrel of shared types. Import from "@/types".

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HeroContent {
  headlineStart: string;
  headlineGradient: string;
  headlineSuffix: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface Plan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  quote: string;
  avatar?: string;
}
