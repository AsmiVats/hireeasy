export default function CTASection() {
    return (
      <div className="relative bg-gradient-to-b from-gray-900 to-purple-900 text-white py-16 sm:py-24 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Boost your productivity today
          </h2>
          <p className="mt-4 text-lg leading-7 text-gray-300">
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua
            proident except eur commodo do ea.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
            >
              Get started
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold text-white ring-1 ring-white/50 hover:ring-white"
            >
              Learn more →
            </a>
          </div>
        </div>
      </div>
    );
  }
  