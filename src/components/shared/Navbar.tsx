"use client";

import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  Home,
  Compass,
  Briefcase,
  Globe,
  MapPin,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "../DateRange";

export const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Experience",
    href: "/experience",
    icon: Compass,
  },
  {
    label: "Services",
    href: "/services",
    icon: Briefcase,
  },
];

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const popularDestinations = [
  "New York, NY",
  "Los Angeles, CA",
  "Miami, FL",
  "San Francisco, CA",
  "Chicago, IL",
  "Las Vegas, NV",
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const navbarRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
      setIsExpanded(false);
      setActiveDropdown(null);
    }
  });

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if the click is inside the filter bar
    const isInsideFilter = target.closest('[data-filter-bar="true"]');

    if (!isInsideFilter) {
      setIsExpanded(false);
      setActiveDropdown(null);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isExpanded, activeDropdown]);

  const updateGuestCount = (type: keyof GuestCounts, increment: boolean) => {
    setGuests((prev) => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  const totalGuests =
    guests.adults + guests.children + guests.infants + guests.pets;

  const handleFilterClick = (filter?: string) => {
    if (scrolled) {
      setIsExpanded(true);
      setActiveDropdown(activeDropdown === filter ? null : filter || null);
    } else {
      setScrolled(false);
      setIsExpanded(false);
      setActiveDropdown(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDateDisplayText = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return `${formatDate(dateRange.startDate)} - ${formatDate(
        dateRange.endDate
      )}`;
    } else if (dateRange.startDate) {
      return formatDate(dateRange.startDate);
    }
    return "Any week";
  };

  return (
    <div
      ref={navbarRef}
      className="fixed top-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-50"
    >
      <motion.nav className="flex flex-col gap-3 py-3 relative">
        <motion.div className="flex items-center justify-between px-4">
          {/* Logo */}
          <Image src={"/logo.png"} width={120} height={100} alt="logo" />

          {/* Animate nav items / filter replacement */}
          <div className="flex-1 flex justify-center items-center">
            <AnimatePresence mode="wait">
              {!scrolled || isExpanded ? (
                <motion.div
                  key="navItems"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:flex gap-6"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 text-gray-700 hover:text-rose-500 transition-colors duration-200"
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="filters"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center w-full rounded-full shadow-lg border border-neutral-200 overflow-hidden max-w-md cursor-pointer hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Compact filter bar */}
                  <div className="flex-1 px-4 py-3 flex items-center justify-between text-sm text-gray-600">
                    <span
                      onClick={() => handleFilterClick("where")}
                      className="font-medium truncate"
                    >
                      {searchLocation || "Anywhere"}
                    </span>
                    <div className="w-px h-5 bg-gray-300 mx-2" />
                    <span
                      onClick={() => handleFilterClick("dates")}
                      className="font-medium truncate"
                    >
                      {getDateDisplayText()}
                    </span>
                    <div className="w-px h-5 bg-gray-300 mx-2" />
                    <span
                      onClick={() => handleFilterClick("who")}
                      className="text-gray-500 truncate"
                    >
                      {totalGuests > 0
                        ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
                        : "Add guests"}
                    </span>
                    <button className="ml-3 bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full shadow-md transition-colors duration-200">
                      <Search size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login / Globe */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Globe size={20} className="text-gray-600" />
            </button>
            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* Expanded filters */}
        <AnimatePresence>
          {(!scrolled || isExpanded) && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-50"
            >
              <div
                data-filter-bar="true"
                className="flex flex-col sm:flex-row items-stretch w-full max-w-4xl mx-auto rounded-2xl shadow-xl border border-neutral-300 overflow-visible bg-white"
              >
                {/* Where */}
                <div className="flex-1 relative">
                  <div
                    className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 h-full flex flex-col justify-center"
                    onClick={() => {
                      setActiveDropdown(
                        activeDropdown === "where" ? null : "where"
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          Where
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchLocation || "Search destinations"}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          activeDropdown === "where" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Where Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === "where" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-2xl z-[200] mt-2 min-w-[300px]"
                      >
                        <div className="p-4">
                          <div className="relative mb-4">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Where are you going?"
                              value={searchLocation}
                              onChange={(e) =>
                                setSearchLocation(e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900 mb-2">
                              Popular destinations
                            </p>
                            {popularDestinations.map((destination) => (
                              <button
                                key={destination}
                                onClick={() => {
                                  setSearchLocation(destination);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                              >
                                {destination}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px bg-gray-200 hidden sm:block" />

                <div className="flex-1 relative">
                  <div
                    className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 h-full flex flex-col justify-center"
                    onClick={() => {
                      setActiveDropdown(
                        activeDropdown === "dates" ? null : "dates"
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-8 w-full items-center justify-around">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="text-xs font-semibold text-gray-900">
                              Check in
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(dateRange.startDate) || "Add date"}
                            </p>
                          </div>

                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              activeDropdown === "dates" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="text-xs font-semibold text-gray-900">
                              Check out
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(dateRange.endDate) || "Add date"}
                            </p>
                          </div>

                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              activeDropdown === "dates" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Range Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === "dates" && (
                      <DateRangePicker
                        dateRange={dateRange}
                        onDateChange={setDateRange}
                        onClose={() => setActiveDropdown(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px bg-gray-200 hidden sm:block" />

                {/* Who */}
                <div className="flex-1 relative">
                  <div
                    className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 h-full flex justify-between items-center"
                    onClick={() => {
                      setActiveDropdown(
                        activeDropdown === "who" ? null : "who"
                      );
                    }}
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Who</p>
                      <p className="text-sm text-gray-500">
                        {totalGuests > 0
                          ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
                          : "Add guests"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          activeDropdown === "who" ? "rotate-180" : ""
                        }`}
                      />
                      <button className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-md transition-colors duration-200">
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Who Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === "who" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-2xl z-[200] mt-2 w-80"
                      >
                        <div className="p-4 space-y-4">
                          {/* Adults */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Adults
                              </p>
                              <p className="text-sm text-gray-500">
                                Ages 13 or above
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  updateGuestCount("adults", false)
                                }
                                disabled={guests.adults <= 1}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {guests.adults}
                              </span>
                              <button
                                onClick={() => updateGuestCount("adults", true)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Children
                              </p>
                              <p className="text-sm text-gray-500">Ages 2-12</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  updateGuestCount("children", false)
                                }
                                disabled={guests.children <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {guests.children}
                              </span>
                              <button
                                onClick={() =>
                                  updateGuestCount("children", true)
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Infants */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Infants
                              </p>
                              <p className="text-sm text-gray-500">Under 2</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  updateGuestCount("infants", false)
                                }
                                disabled={guests.infants <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {guests.infants}
                              </span>
                              <button
                                onClick={() =>
                                  updateGuestCount("infants", true)
                                }
                                className="w-8 h-8 rounded-full border border-gray-400 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Pets */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Pets</p>
                              <p className="text-sm text-gray-500">
                                Bringing a service animal?
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateGuestCount("pets", false)}
                                disabled={guests.pets <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {guests.pets}
                              </span>
                              <button
                                onClick={() => updateGuestCount("pets", true)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
