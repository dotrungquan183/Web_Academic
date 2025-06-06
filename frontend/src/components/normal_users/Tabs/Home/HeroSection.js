import React from "react";
import { motion } from "framer-motion";
import { UserPlus, BookOpen } from "lucide-react";
import heroImage from "./math_img.jpg";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Decorative Icons */}
      <div className="hero-icon icon-top-left">+</div>
      <div className="hero-icon icon-bottom-right">÷</div>

      {/* Grid layout */}
      <div className="hero-grid">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Khám phá <span className="hero-highlight">vẻ đẹp</span> bất biến của Toán học
          </h1>
          <p className="hero-text">
            Tham gia cộng đồng yêu toán để cùng học hỏi, chia sẻ và chinh phục những thử thách thú vị – từ đại số cơ bản đến giải tích nâng cao.
          </p>
          <div className="hero-buttons">
            <button className="btn-join">
              <UserPlus className="w-5 h-5" />
              Tham gia ngay
            </button>
            <button className="btn-outline">
              <BookOpen className="w-5 h-5" />
              Khám phá
            </button>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-image-wrapper"
        >
          <img
            src={heroImage}
            alt="Math Illustration"
            className="hero-image"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
