import type { ContactDetails, GalleryFramesSetting, HomepageContent, SeoSettings } from "@hausofmusa/types";

export const defaultHomepageContent: HomepageContent = {
  heroTitle: "Engineering Tomorrow.",
  heroSubtitle: "Enterprise ERP, SaaS, and AI-ready infrastructure - engineered from a single digital headquarters.",
  primaryCtaLabel: "Book Consultation",
  secondaryCtaLabel: "View Products",
  secondaryCtaHref: "/products",
  storySections: [
    {
      eyebrow: "Innovation",
      title: "Every wing of this building solves a different problem.",
      body: "From ERP cores to AI-ready infrastructure, our teams are organized the way our headquarters is built - purpose-designed spaces, not one-size-fits-all software.",
    },
    {
      eyebrow: "Technology",
      title: "Modern stacks, chosen for longevity.",
      body: "Next.js, cloud-native services, and typed foundations throughout - built so what we ship today still makes sense to maintain in five years.",
    },
    {
      eyebrow: "Engineering",
      title: "Discipline is the product.",
      body: "Code review, testing, and observability are not afterthoughts. They are why enterprise clients trust us with systems that cannot go down.",
    },
    {
      eyebrow: "Trust",
      title: "Partnerships measured in years, not tickets.",
      body: "We embed with your team through digital transformation, not just deliver and disappear. Long-term relationships are how enterprise software should work.",
    },
    {
      eyebrow: "Quality",
      title: "Reviewed at every level, shipped without compromise.",
      body: "Design, architecture, and code all pass through the same bar - the one you would expect from the systems running your business.",
    },
    {
      eyebrow: "Products",
      title: "Walk through what we have built.",
      body: "Eight flagship products spanning ERP, SaaS, and cloud infrastructure - each with a real case study behind it.",
      href: "/products",
      linkLabel: "Explore the products",
    },
    {
      eyebrow: "Future",
      title: "Built for what enterprise software becomes next.",
      body: "AI-ready by default, cloud-native from day one - infrastructure designed for where your business is headed, not just where it is today.",
    },
  ],
};

export const defaultContactDetails: ContactDetails = {
  email: "hello@hausofmusa.com",
  phone: "",
  location: "Remote-first",
  address: "",
  whatsappUrl: "",
  calendlyUrl: "",
};

export const defaultGalleryFrames: GalleryFramesSetting = {
  frames: Array.from({ length: 8 }, (_, index) => ({
    albumKey: `album${index + 1}` as GalleryFramesSetting["frames"][number]["albumKey"],
    productSlug: "",
    label: "",
    enabled: true,
  })),
};

export const defaultSeoSettings: SeoSettings = {
  defaultTitle: "Haus of Musa - Engineering Tomorrow",
  defaultDescription:
    "Haus of Musa builds enterprise ERP systems, SaaS products, AI-ready infrastructure, and digital transformation solutions for ambitious companies.",
  ogImage: "",
  routes: [
    {
      path: "/",
      title: "Haus of Musa - Engineering Tomorrow",
      description:
        "Enterprise ERP, SaaS, and AI-ready infrastructure engineered from a single digital headquarters.",
      ogImage: "",
    },
    {
      path: "/products",
      title: "Products",
      description: "Explore Haus of Musa products across ERP, SaaS, AI infrastructure, cloud, and web platforms.",
      ogImage: "",
    },
    {
      path: "/careers",
      title: "Careers",
      description: "Join Haus of Musa and help build durable enterprise software systems.",
      ogImage: "",
    },
  ],
};

export const defaultSettings = {
  "homepage-content": defaultHomepageContent,
  "contact-details": defaultContactDetails,
  "gallery-frames": defaultGalleryFrames,
  seo: defaultSeoSettings,
};

export type SettingKey = keyof typeof defaultSettings;
