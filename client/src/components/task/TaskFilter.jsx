import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TaskFilters({
  counts,
  handleFilterChange,
  resetFilters,
}) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [activeKey, setActiveKey] = useState("all");

  const items = [
    { key: "all", label: "All Tasks", color: "blue" },
    { key: "pending", label: "Pending", color: "yellow" },
    { key: "completed", label: "Completed", color: "green" },
    { key: "inProgress", label: "In Progress", color: "blue" },
    { key: "today", label: "Today", color: "gray" },
    { key: "overdue", label: "Overdue", color: "red" },
    { key: "withSubtask", label: "With Subtask", color: "purple" },
    { key: "withoutSubtask", label: "Without Subtask", color: "indigo" },
  ];

  // Map colors → Tailwind classes
  const colorClasses = {
    blue: "bg-blue-500 text-white border-blue-500",
    yellow: "bg-yellow-500 text-white border-yellow-500",
    green: "bg-green-500 text-white border-green-500",
    gray: "bg-gray-500 text-white border-gray-500",
    red: "bg-red-500 text-white border-red-500",
    purple: "bg-purple-500 text-white border-purple-500",
    indigo: "bg-indigo-500 text-white border-indigo-500",
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount =
      direction === "left" ? -clientWidth / 2 : clientWidth / 2;
    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  const updateNavVisibility = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateNavVisibility();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNavVisibility);
    window.addEventListener("resize", updateNavVisibility);
    return () => {
      el.removeEventListener("scroll", updateNavVisibility);
      window.removeEventListener("resize", updateNavVisibility);
    };
  }, []);

  const handleClick = (item) => {
    setActiveKey(item.key);
    if (["pending", "completed", "inProgress"].includes(item.key)) {
      handleFilterChange(
        "status",
        item.key === "inProgress" ? "in-progress" : item.key
      );
    } else if (item.key === "today") {
      handleFilterChange("filter", "today");
    } else if (item.key === "overdue") {
      handleFilterChange("filter", "overdue");
    } else if (item.key === "withSubtask") {
      handleFilterChange("filter", "with-subtask");
    } else if (item.key === "withoutSubtask") {
      handleFilterChange("filter", "without-subtask");
    } else if (item.key === "all") {
      resetFilters();
    }
  };

  return (
    <div className="relative mt-4 w-full">
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10 md:hidden">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 pt-6 overflow-x-auto pb-2 md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-4 scroll-smooth no-scrollbar snap-x">
        {items.map((item) => (
          <Button
            key={item.key}
            onClick={() => handleClick(item)}
            className={`relative shrink-0 snap-start ${
              activeKey === item.key
                ? colorClasses[item.color] 
                : "bg-white text-gray-800 dark:text-white dark:bg-slate-800 border-gray-300"
            }`}>
            <span className="absolute -top-3 -right-2 flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full">
              {counts[item.key] || 0}
            </span>
            <span>{item.label}</span>
          </Button>
        ))}
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10 md:hidden">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
