import { useMemo } from "react";

function useArticleStats(articles = []) {
  return useMemo(() => {
    if (!articles || !articles.length) {
      return {
        total: 0,
        byMonth: {},
        byWeekday: {},
        mostActiveMonth: null,
        mostActiveDay: null,
        articlesByDate: {},
        firstArticleDate: null,
        latestArticleDate: null,
        averagePerMonth: 0,
        currentStreak: 0,
        longestStreak: 0,
        isActiveToday: false,
      };
    }
    
    // Standardize today's date - set to midnight in local timezone to ensure consistent comparisons
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const months = [
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
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const byMonth = {};
    const byWeekday = {};
    const articlesByDate = {};
    let firstArticleDate = null;
    let latestArticleDate = null;

    // Process all articles
    articles.forEach((article) => {
      if (!article.createdAt) return;
      
      // Normalize the date to midnight in local timezone
      const articleDate = new Date(article.createdAt);
      if (isNaN(articleDate.getTime())) return;
      
      // Normalize to beginning of day for consistent date comparison
      const normalizedDate = new Date(
        articleDate.getFullYear(),
        articleDate.getMonth(),
        articleDate.getDate()
      );
      
      // Skip future dates
      if (normalizedDate > today) return;
      
      if (!firstArticleDate || normalizedDate < firstArticleDate) {
        firstArticleDate = normalizedDate;
      }
      if (!latestArticleDate || normalizedDate > latestArticleDate) {
        latestArticleDate = normalizedDate;
      }
      
      const monthName = months[normalizedDate.getMonth()];
      byMonth[monthName] = (byMonth[monthName] || 0) + 1;
      
      const weekdayName = weekdays[normalizedDate.getDay()];
      byWeekday[weekdayName] = (byWeekday[weekdayName] || 0) + 1;
      
      const dateKey = normalizedDate.toISOString().split("T")[0];
      articlesByDate[dateKey] = (articlesByDate[dateKey] || 0) + 1;
    });

    // Find most active month
    let mostActiveMonth = null;
    let maxMonthCount = 0;
    Object.entries(byMonth).forEach(([month, count]) => {
      if (count > maxMonthCount) {
        mostActiveMonth = month;
        maxMonthCount = count;
      }
    });

    // Find most active day
    let mostActiveDay = null;
    let maxDayCount = 0;
    Object.entries(byWeekday).forEach(([day, count]) => {
      if (count > maxDayCount) {
        mostActiveDay = day;
        maxDayCount = count;
      }
    });

    // Calculate average articles per month
    let averagePerMonth = 0;
    if (firstArticleDate && latestArticleDate) {
      const monthDiff =
        (latestArticleDate.getFullYear() - firstArticleDate.getFullYear()) * 12 +
        (latestArticleDate.getMonth() - firstArticleDate.getMonth()) + 1;
      averagePerMonth =
        monthDiff > 0 ? (articles.length / monthDiff).toFixed(1) : articles.length;
    }

    // Calculate streaks
    const todayKey = today.toISOString().split("T")[0];
    const isActiveToday = !!articlesByDate[todayKey];
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // If there's activity today, start counting
    if (isActiveToday) {
      currentStreak = 1;
      tempStreak = 1;
      
      // Check backwards from yesterday
      let checkDate = new Date(today);
      
      while (true) {
        // Move to previous day
        checkDate.setDate(checkDate.getDate() - 1);
        const checkKey = checkDate.toISOString().split("T")[0];
        
        if (articlesByDate[checkKey]) {
          currentStreak++;
          tempStreak++;
        } else {
          break;
        }
      }
    } else {
      // Check if yesterday had activity
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];
      
      if (articlesByDate[yesterdayKey]) {
        // Count backwards from yesterday
        currentStreak = 1;
        tempStreak = 1;
        
        let checkDate = new Date(yesterday);
        while (true) {
          // Move to previous day
          checkDate.setDate(checkDate.getDate() - 1);
          const checkKey = checkDate.toISOString().split("T")[0];
          
          if (articlesByDate[checkKey]) {
            currentStreak++;
            tempStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    if (tempStreak > 0 && tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    
    // Find the longest streak by checking all date ranges
    const sortedDates = Object.keys(articlesByDate).sort();
    tempStreak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
        continue;
      }
      
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i-1]);
      
      // Normalize to beginning of day
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      // Calculate days between
      const dayDiff = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        // Streak broken
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
    
    // Check if the last streak is the longest
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return {
      total: articles.length,
      byMonth,
      byWeekday,
      mostActiveMonth,
      mostActiveDay,
      articlesByDate,
      firstArticleDate,
      latestArticleDate,
      averagePerMonth,
      currentStreak,
      longestStreak,
      isActiveToday,
    };
  }, [articles]);
}

export default useArticleStats;