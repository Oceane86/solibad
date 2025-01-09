'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import clsx from "clsx"; // Ajoute clsx pour gérer les classes dynamiques
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Link from "next/link";

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export function Header( { page }) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession();
  return (
      <header className="bg-white">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                  alt=""
                  src="https://static.wixstatic.com/media/20ece8_aab1d120121d4cf6b38413aaad1bc3b6~mv2.png/v1/fill/w_181,h_68,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/solibad_fr-1.png"
                  className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">

              <PopoverPanel
                  transition
                  className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
              >

                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                      <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400"/>
                        {item.name}
                      </a>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>

            <a href="/" className={clsx("text-sm/6 font-semibold text-gray-900 ", page === "accueil" && "underline")}>
              Accueil
            </a>
            <a href="/agenda" className={clsx("text-sm/6 font-semibold text-gray-900 ", page === "agenda" && "underline")}>
              Agenda
            </a>
            <a href="/my-bids" className={clsx("text-sm/6 font-semibold text-gray-900 ", page === "mes-encheres" && "underline")}>
              Mes enchères
            </a>
          </PopoverGroup>
          {session && (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="/profil" className={clsx("text-sm/6 font-semibold text-gray-900 ", page === "mon-compte" && "underline")}>
                  Mon compte <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
          )}
          {!session && (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="/login" className={clsx("text-sm/6 font-semibold text-gray-900 ", page === "connexion" && "underline")}>
                  Connexion <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
          )}

        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-10"/>
          <DialogPanel
              className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                    alt=""
                    src="https://static.wixstatic.com/media/20ece8_aab1d120121d4cf6b38413aaad1bc3b6~mv2.png/v1/fill/w_181,h_68,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/solibad_fr-1.png"
                    className="h-8 w-auto"
                />
              </a>
              <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                      href="/"
                      className={clsx("-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50", page === "accueil" && "underline")}>

                    Accueil
                  </a>
                  <a
                      href="/agenda"
                      className={clsx("-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50", page === "agenda" && "underline")}>

                  Agenda
                  </a>
                  <a
                      href="/my-bids"
                      className={clsx("-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50", page === "mes-encheres" && "underline")}>
                    Mes enchères
                  </a>
                </div>
                <div className="py-6">
                  {session && (
                      <a
                          href="/profil"
                          className={clsx("-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50", page === "mon-compte" && "underline")}>


                        Mon compte
                      </a>
                  )}
                  {!session && (
                      <a
                          href="/login"
                          className={clsx("-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50", page === "connexion" && "underline")}>

                      Connexion
                      </a>
                  )}
                </div>

              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
  )
}

export default Header;
