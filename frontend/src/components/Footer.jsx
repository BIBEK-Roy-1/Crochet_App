import {
  Instagram,
  MessageCircle,
  Mail,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#334155] text-[#faf7f2]">

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-3 md:px-8">

        {/* Brand */}
        <div>
          <div className="font-bengali text-3xl font-bold">
            মেঘলা
          </div>

          <p className="mt-4 max-w-sm text-sm leading-7 text-[#cbd5e1]">
            Handcrafted crochet pieces inspired by monsoon skies,
            cozy days, and a little Bengali warmth.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-serif-custom text-lg text-[#c05640]">
            Explore
          </h3>

          <div className="mt-5 space-y-3 text-sm text-[#cbd5e1]">
            <Link
              className="block transition hover:text-white"
              to="/collection"
            >
              Shop All
            </Link>

            <Link
              className="block transition hover:text-white"
              to="/about"
            >
              About Meghla
            </Link>

            <Link
              className="block transition hover:text-white"
              to="/admin/login"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="font-serif-custom text-lg text-[#849b79]">
            Stay in touch
          </h3>

          <p className="mt-5 text-sm leading-6 text-[#cbd5e1]">
            Have a question or want to place an order?
            We'd love to hear from you.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="8158831287"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-[#1e293b] px-4 py-2.5 text-sm text-[#cbd5e1] transition hover:border-[#849b79] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/meghlacrochet/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-[#1e293b] px-4 py-2.5 text-sm text-[#cbd5e1] transition hover:border-[#c05640] hover:text-white"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>

            {/* Email */}
            <a
              href="mailto:meghlacrochet@gmail.com"
              aria-label="Email"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-[#1e293b] px-4 py-2.5 text-sm text-[#cbd5e1] transition hover:border-[#c9a79b] hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-4 py-5 text-sm text-[#94a3b8] md:px-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 md:flex-row">

          <span>
            © 2026 Meghla Crochet
          </span>

          <span className="inline-flex items-center gap-1">
            Made with
            <Heart className="h-4 w-4 fill-current text-[#c05640]" />
          </span>

        </div>
      </div>

    </footer>
  );
}