"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export const DateRangePicker = ({
  dateRange,
  onDateChange,
  onClose,
}: {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  onClose: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const nextMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    return date >= dateRange.startDate && date <= dateRange.endDate;
  };

  const isDateInHoverRange = (date: Date) => {
    if (!dateRange.startDate || !hoveredDate || dateRange.endDate) return false;
    const start = dateRange.startDate;
    const end = hoveredDate;
    return (
      date >= Math.min(start.getTime(), end.getTime()) &&
      date <= Math.max(start.getTime(), end.getTime())
    );
  };

  const handleDateClick = (date: Date) => {
    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      // Start new selection
      onDateChange({ startDate: date, endDate: null });
    } else {
      // Complete the range
      if (date < dateRange.startDate) {
        onDateChange({ startDate: date, endDate: dateRange.startDate });
      } else {
        onDateChange({ startDate: dateRange.startDate, endDate: date });
      }
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = (month: Date) => {
    const days = getDaysInMonth(month);

    return (
      <div className="p-2 md:p-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-sm md:text-lg font-semibold text-gray-900">
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </h3>
          {month.getTime() === currentMonth.getTime() && (
            <div className="flex gap-1 md:gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={14} className="md:w-4 md:h-4 w-3 h-3" />
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={14} className="md:w-4 md:h-4 w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1 md:mb-2">
          {dayNames.map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-medium text-gray-500 py-1 md:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 md:gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-7 md:h-10" />;
            }

            const isSelected =
              dateRange.startDate?.toDateString() === date.toDateString() ||
              dateRange.endDate?.toDateString() === date.toDateString();
            const isInRange = isDateInRange(date);
            const isInHoverRange = isDateInHoverRange(date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isPast}
                className={`
                  h-7 w-7 md:h-10 md:w-10 rounded-full text-xs md:text-sm font-medium transition-all duration-200
                  ${
                    isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  }
                  ${
                    isSelected ? "bg-gray-900 text-white hover:bg-gray-800" : ""
                  }
                  ${
                    (isInRange || isInHoverRange) && !isSelected
                      ? "bg-gray-100"
                      : ""
                  }
                  ${
                    isToday && !isSelected
                      ? "border border-gray-900 md:border-2"
                      : ""
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[200] mt-2 w-[95vw] max-w-[600px]"
    >
      <div className="p-3 md:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold">
            Select Date Range
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            ✕
          </button>
        </div>
      </div>

      {isMobile ? (
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {renderCalendar(currentMonth)}
            <div className="w-px bg-gray-200" />
            {renderCalendar(nextMonth)}
          </div>
        </div>
      ) : (
        <div className="flex">
          {renderCalendar(currentMonth)}
          <div className="w-px bg-gray-200" />
          {renderCalendar(nextMonth)}
        </div>
      )}

      <div className="p-3 md:p-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => onDateChange({ startDate: null, endDate: null })}
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          Apply
        </button>
      </div>
    </motion.div>
  );
};
