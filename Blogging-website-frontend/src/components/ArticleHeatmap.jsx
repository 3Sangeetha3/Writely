import React, { useEffect, useState, useRef } from "react";
import { Activity, Calendar, Flame } from "lucide-react";

const ArticleHeatmap = ({ articles = [] }) => {
  const [heatmapData, setHeatmapData] = useState({
    cells: [],
    months: [],
    currentStreak: 0,
    maxStreak: 0,
    totalArticles: 0,
  });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!articles || !articles.length) {
      return;
    }

    // Process the article data for the heatmap
    const data = processHeatmapData(articles);
    setHeatmapData(data);
  }, [articles]);

  useEffect(() => {
    // Scroll to the end of the container when data is loaded
    if (scrollContainerRef.current && heatmapData.cells.length > 0) {
      const container = scrollContainerRef.current;
      container.scrollLeft = container.scrollWidth;
    }
  }, [heatmapData.cells]);

  const processHeatmapData = (articles) => {
    // Get article counts by date
    const articlesByDate = {};
    articles.forEach((article) => {
      if (!article.createdAt) return;

      const date = new Date(article.createdAt);
      if (isNaN(date.getTime())) return;

      // Normalize to beginning of day in local timezone
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      // Skip future dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (normalizedDate > today) return;

      const dateKey = normalizedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      articlesByDate[dateKey] = (articlesByDate[dateKey] || 0) + 1;
    });

    // Generate the calendar grid
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate start date (1 year ago from today)
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    // Calculate day offset to ensure the grid starts on a Sunday
    const dayOffset = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOffset);

    // Generate calendar cells covering 53 weeks (to ensure complete year coverage)
    const cells = [];
    const cellDate = new Date(startDate);

    // Track months for labels
    const months = [];
    let lastMonth = -1;

    // Generate 53 weeks x 7 days grid
    for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
      const week = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        // Create a new date object for each cell to avoid reference issues
        const currentCellDate = new Date(cellDate);

        // Check if we need to add a month label
        if (dayIndex === 0 && currentCellDate.getMonth() !== lastMonth) {
          months.push({
            name: currentCellDate.toLocaleString("default", { month: "short" }),
            index: weekIndex,
          });
          lastMonth = currentCellDate.getMonth();
        }

        // Create date key for the normalized date (YYYY-MM-DD)
        const dateKey = currentCellDate.toISOString().split("T")[0];
        const count = articlesByDate[dateKey] || 0;

        // Determine if this cell is today
        const isToday = currentCellDate.getTime() === today.getTime();
        const isPast = currentCellDate <= today;

        week.push({
          date: currentCellDate,
          dateKey,
          count,
          isToday,
          isPast,
        });

        // Move to the next day
        cellDate.setDate(cellDate.getDate() + 1);
      }

      cells.push(week);
    }

    // Calculate streaks
    const { currentStreak, maxStreak } = calculateStreaks(articlesByDate);

    return {
      cells,
      months,
      currentStreak,
      maxStreak,
      totalArticles: articles.length,
    };
  };

  const calculateStreaks = (articlesByDate) => {
    const dates = Object.keys(articlesByDate).sort();
    let currentStreak = 0;
    let maxStreak = 0;

    // Calculate the longest streak
    let tempStreak = 0;
    let lastDate = null;

    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);

      if (lastDate) {
        const dayDiff = Math.round(
          (currentDate - lastDate) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          // Consecutive day
          tempStreak++;
        } else {
          // Streak broken
          if (tempStreak > maxStreak) {
            maxStreak = tempStreak;
          }
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      lastDate = currentDate;
    }

    // Check final streak
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayKey = today.toISOString().split("T")[0];
    const hasActivityToday = articlesByDate[todayKey] > 0;

    if (hasActivityToday) {
      // Count backward from today
      currentStreak = 1;
      let checkDate = new Date(today);

      while (true) {
        // Move to previous day
        checkDate.setDate(checkDate.getDate() - 1);
        const checkKey = checkDate.toISOString().split("T")[0];

        if (articlesByDate[checkKey] > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      // Check if yesterday had activity
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];

      if (articlesByDate[yesterdayKey] > 0) {
        // Count backward from yesterday
        currentStreak = 1;
        let checkDate = new Date(yesterday);

        while (true) {
          // Move to previous day
          checkDate.setDate(checkDate.getDate() - 1);
          const checkKey = checkDate.toISOString().split("T")[0];

          if (articlesByDate[checkKey] > 0) {
            currentStreak++;
          } else {
            break;
          }
        }
      } else {
        currentStreak = 0;
      }
    }

    return { currentStreak, maxStreak };
  };

  const getColorIntensity = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  const getCellStyle = (cell) => {
    const intensity = getColorIntensity(cell.count);

    let baseClass = "w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all ";

    switch (intensity) {
      case 0:
        baseClass += cell.isPast
          ? "bg-gray-200"
          : "bg-gray-100 opacity-50";
        break;
      case 1:
        baseClass += "bg-[#001514]/20 hover:bg-[#001514]/30";
        break;
      case 2:
        baseClass += "bg-[#001514]/40 hover:bg-[#001514]/50";
        break;
      case 3:
        baseClass += "bg-[#001514]/60 hover:bg-[#001514]/70";
        break;
      case 4:
        baseClass += "bg-[#001514]/80 hover:bg-[#001514]/90";
        break;
      default:
        baseClass += "bg-gray-200 dark:bg-gray-700";
    }

    // Add special styling for today
    if (cell.isToday) {
      baseClass += " ring-2 ring-[#53C7C0]";
    }

    // Add hover effect
    baseClass += " hover:scale-110 hover:shadow-sm";

    return baseClass;
  };

  const formatTooltipDate = (date) => {
    // Create a new Date object to avoid mutating the original date
    const tooltipDate = new Date(date);

    return tooltipDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderActivityLegend = () => {
    const levels = [
      { level: 0, label: "No activity", color: "bg-gray-200" },
      { level: 1, label: "1 article", color: "bg-[#243635]/20" },
      { level: 2, label: "2 articles", color: "bg-[#243635]/40" },
      { level: 3, label: "3-4 articles", color: "bg-[#243635]/60" },
      { level: 4, label: "5+ articles", color: "bg-[#243635]/80" },
    ];

    return (
      <div className="flex items-center justify-end mt-3 text-xs text-[#475756]">
        <span className="mr-2 font-medium">Less</span>
        {levels.map((item) => (
          <div
            key={item.level}
            className={`w-3 h-3 rounded-sm ${item.color} mr-1 transition-transform hover:scale-110`}
            title={item.label}
          ></div>
        ))}
        <span className="ml-1 font-medium">More</span>
      </div>
    );
  };

  // Empty state
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg border border-[#E0E3E3] dark:border-[#243635] shadow-inner">
        <Activity size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-[#475756] font-medium">No activity data available</p>
        <p className="text-gray-400 text-sm mt-1">
          Publish articles to see your contribution history
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-[#475756]">
          <p className="font-medium">
            Showing article publishing activity for the past year
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 border border-[#E0E3E3] transition-all hover:shadow-lg">
        {/* Horizontally scrollable container */}
        <div className="overflow-x-auto" ref={scrollContainerRef}>
          <div className="min-w-max">
            {/* Month Headers */}
            <div className="flex mb-1 relative h-5">
              <div className="w-10"></div> {/* Space for day labels */}
              <div className="flex-grow relative">
                {heatmapData.months.map((month, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-[#475756] font-medium absolute"
                    style={{ left: `${(month.index / 52) * 100}%` }}
                  >
                    {month.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex">
              {/* Day of week labels */}
              <div className="flex flex-col w-10 text-right pr-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, idx) => (
                    <div
                      key={idx}
                      className="h-4 text-xs text-[#243635] mb-[0.4rem]"
                    >
                      {idx % 2 === 0 ? day : ""}
                    </div>
                  )
                )}
              </div>

              {/* Calendar cells */}
              <div className="flex-grow grid grid-rows-7 grid-flow-col gap-1">
                {heatmapData.cells.map((week, weekIdx) => (
                  <React.Fragment key={`week-${weekIdx}`}>
                    {week.map((cell, dayIdx) => (
                      <div
                        key={`day-${weekIdx}-${dayIdx}`}
                        className={getCellStyle(cell)}
                        title={`${formatTooltipDate(cell.date)}: ${
                          cell.count || "No"
                        } article${cell.count !== 1 ? "s" : ""} ${
                          cell.isToday ? "(Today)" : ""
                        }`}
                      ></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {renderActivityLegend()}

        {/* Streak Information */}
        <div className="mt-6 border-t border-[#E0E3E3] pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="streak-info bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-transform hover:scale-102 hover:shadow-sm">
              <div className="flex items-center mb-2">
                <Flame size={18} className="text-[#53C7C0] mr-2" />
                <div className="text-sm font-medium text-[#475756]">
                  Current Streak
                </div>
              </div>
              <div className="text-2xl font-bold text-[#53C7C0]">
                {heatmapData.currentStreak}{" "}
                <span className="text-sm font-medium">
                  {heatmapData.currentStreak === 1 ? "Day" : "Days"}
                </span>
              </div>
            </div>
            <div className="streak-info bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-transform hover:scale-102 hover:shadow-sm">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-[#53C7C0] mr-2" />
                <div className="text-sm font-medium text-[#475756]">
                  Max Streak
                </div>
              </div>
              <div className="text-2xl font-bold text-[#243635]">
                {heatmapData.maxStreak}{" "}
                <span className="text-sm font-medium">
                  {heatmapData.maxStreak === 1 ? "Day" : "Days"}
                </span>
              </div>
            </div>
            <div className="streak-info bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-transform hover:scale-102 hover:shadow-sm">
              <div className="flex items-center mb-2">
                <Activity size={18} className="text-[#53C7C0] mr-2" />
                <div className="text-sm font-medium text-[#475756]">
                  Total Articles
                </div>
              </div>
              <div className="text-2xl font-bold text-[#243635]">
                {heatmapData.totalArticles}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeatmap;
