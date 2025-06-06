import React from "react";
import HeroSection from "./Home/HeroSection";
import TrendingDiscussions from "./Home/TrendingDiscussions";
import UpcomingCourses from "./Home/UpcomingCourses";
 
function HomeTab() {
  return (
    <div>
      <HeroSection />
      <TrendingDiscussions />
      <UpcomingCourses />
    </div>
  );
}
 
export default HomeTab;
 