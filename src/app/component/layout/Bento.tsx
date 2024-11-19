export default function Bento() {
    return (
      <div className="bg-gray-900 py-24 sm:py-32"> {/* Changed to dark gray background */}
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-base/7 font-semibold text-indigo-400"> {/* Adjusted to lighter indigo */}
            Work Faster
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {/* Changed text to white */}
            Everything you need to fasten up training
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-gray-800 lg:rounded-l-[2rem]"></div> {/* Darker card background */}
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                    Mobile friendly
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center"> {/* Adjusted paragraph text */}
                    Our webapp is completely Mobile Friendly as the client can attend calls on Mobile seamlessly.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-600 bg-gray-800 shadow-2xl">
                    <img
                      className="size-full object-cover object-top"
                      src="https://i.postimg.cc/Xvz4rp00/Mobile-Screenshot.png"
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10 lg:rounded-l-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-t-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                    Performance Report
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    Benchmark against the best and get a 360-degree view of your sales.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <img
                    className="w-full max-lg:max-w-xs"
                    src="https://tailwindui.com/plus/img/component-images/bento-03-performance.png"
                    alt=""
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10 max-lg:rounded-t-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-gray-800"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                    Encrypted
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    Our calls are very secure and can only be accessed by desired personals.
                  </p>
                </div>
                <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                  <img
                    className="h-[min(152px,40cqw)] object-cover"
                    src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                    alt=""
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10"></div>
            </div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                    Powerful APIs
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                    No more painful API integrations with third-party vendors.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-800 shadow-2xl">
                    <div className="flex bg-gray-700/40 ring-1 ring-white/10">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-300">
                        <div className="-mb-px border-b border-b-white/20 bg-white/5 px-4 py-2 text-white">
                          Layout.jsx
                        </div>
                        <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                      </div>
                    </div>
                    <div className="px-6 pb-14 pt-6 text-gray-300"> {/* Adjusted text color for code snippet */}
                      {"import { useState } from 'react' import { Dialog, DialogPanel } from '@headlessui/react' import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-white/10 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  