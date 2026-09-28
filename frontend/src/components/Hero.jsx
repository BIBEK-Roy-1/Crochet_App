import { ArrowRight, Flower2, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero({ highlightedProduct }) {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#faf7f2] pb-20 pt-32 lg:pb-28 lg:pt-40">
      {/* Bengali-inspired dotted background from the original design */}
      <div className="bg-alpona pointer-events-none absolute inset-0 z-0" />

      {/* Decorative cloud + flower elements restored */}
      <div className="animate-float-cloud pointer-events-none absolute right-10 top-20 z-0 hidden text-[#94a3b8] opacity-40 md:block">
        <Wind className="h-32 w-32" strokeWidth={1} />
      </div>

      <div className="animate-float-lotus pointer-events-none absolute bottom-16 left-8 z-0 text-[#c05640] opacity-30 md:left-10">
        <Flower2 className="h-24 w-24" strokeWidth={1.5} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#c05640]" />
            <span className="text-sm font-semibold uppercase tracking-wide text-[#c05640]">
              Welcome to Meghla
            </span>
          </div>

          <p className="mb-3 font-bengali text-lg font-medium text-[#849b79]">
            সুতোয় বোনা গল্প
          </p>

          <h1 className="font-bengali text-7xl font-bold leading-none text-[#334155] md:text-8xl">
            মেঘলা
          </h1>

          <h2 className="font-serif-custom mb-6 mt-6 text-4xl font-bold leading-tight text-[#334155] md:text-5xl">
            Crochet made for{' '}
            <span className="italic text-[#94a3b8]">cozy</span> days.
          </h2>

          <p className="mb-10 max-w-xl text-lg font-light leading-8 text-[#64748b]">
            Soft handmade crochet pieces for everyday warmth, thoughtful gifting,
            and a little Bengali warmth.
          </p>

          <Link
            to="/collection"
            className="kantha-border group relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-[#c05640] px-8 py-3.5 text-lg font-medium text-white shadow-lg transition-all hover:bg-[#a64733] hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Collection
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        <div className="relative mt-10 lg:ml-10 lg:mt-0">
          <div className="absolute -inset-4 rotate-3 rounded-tl-[100px] rounded-br-[100px] bg-[#c05640] opacity-10" />
          <div className="kantha-border absolute -inset-4 -rotate-2 rounded-tl-[100px] rounded-br-[100px] border-2 border-[#849b79]" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[80px] rounded-br-[80px] bg-white p-2 shadow-2xl">
            <img
              src={
                highlightedProduct?.images?.[0] ||
                'https://images.unsplash.com/photo-1584985223298-5d27299a9b71?auto=format&fit=crop&w=1000&q=85'
              }
              alt={highlightedProduct?.title || 'Meghla Crochet'}
              className="h-full w-full rounded-tl-[72px] rounded-br-[72px] object-cover"
            />

            <div className="absolute inset-0 rounded-tl-[72px] rounded-br-[72px] bg-gradient-to-t from-[#334155]/80 to-transparent" />

            <div className="absolute bottom-10 left-10 pr-4 text-white">
              <p className="font-serif-custom mb-1 text-2xl font-bold">
                {highlightedProduct?.title || 'Handmade Comfort'}
              </p>
              <p className="text-sm text-[#cbd5e1]">
                {highlightedProduct?.subtitle || 'Made slowly, meant to last.'}
              </p>
              {highlightedProduct?.price && (
                <p className="mt-2 font-medium">{highlightedProduct.price}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
