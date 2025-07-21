import React, { useRef, useEffect, useState } from "react";
import { ArticleList, PopularTags, Footer } from "../components";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import Typed from "typed.js";
import { 
  Users, 
  Globe, 
  Hash, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Zap,
  Star,
  Trophy,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  ChevronDown,
  PenTool,
  Compass,
  Feather
} from "lucide-react";
import classNames from "classnames";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";

const initialFilters = { tag: "", offset: null, feed: false };

function Home() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    ...initialFilters,
    feed: isAuth,
  });
  const articlesRef = useRef(null);

  useEffect(() => {
    setFilters({ ...initialFilters, feed: isAuth });
  }, [isAuth]);

  // Typed.js for animated hero text
  const typedElementRef = useRef(null);

  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      easing: "ease-out-cubic", 
      once: true,
      offset: 100
    });

    let typedInstance;
    if (typedElementRef.current) {
      typedInstance = new Typed(typedElementRef.current, {
        strings: [
          "Share your knowledge.",
          "Inspire with your words.",
          "Connect through stories.",
          "Build your community.",
          "Express your creativity.",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
      });
    }

    return () => {
      if (typedInstance) typedInstance.destroy();
    };
  }, []);

  function onTagClick(tag) {
    setFilters({ ...initialFilters, tag });
    if (articlesRef.current) {
      articlesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function onGlobalFeedClick() {
    setFilters(initialFilters);
  }

  function onFeedClick() {
    setFilters({ ...initialFilters, feed: true });
  }

  const features = [
    {
      icon: PenTool,
      title: "Write & Create",
      description: "Express your ideas with our powerful editor and reach a global audience",
      color: "from-[#53C7C0] to-[#4AB3AC]"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with passionate writers and readers who share your interests",
      color: "from-[#243635] to-[#475756]"
    },
    {
      icon: TrendingUp,
      title: "Grow Together",
      description: "Build your personal brand and expand your influence through quality content",
      color: "from-[#53C7C0] to-[#243635]"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50/50 to-teal-50/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#53C7C0]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#243635]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg px-8 py-4 rounded-full border border-[#53C7C0]/30 shadow-lg shadow-[#53C7C0]/10 mb-8 hover:shadow-xl hover:shadow-[#53C7C0]/20 transition-all duration-500"
            data-aos="fade-down"
          >
            <Sparkles className="w-5 h-5 text-[#53C7C0] animate-pulse" />
            <span className="text-[#243635] font-semibold tracking-wide">Welcome to the Community</span>
            <Sparkles className="w-5 h-5 text-[#53C7C0] animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="bg-gradient-to-r from-[#243635] via-[#53C7C0] to-[#243635] bg-clip-text text-transparent">
              Writely
            </span>
          </h1>

          {/* Typed Subtitle */}
          <div 
            className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-light min-h-[3rem] mb-12"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <span ref={typedElementRef}></span>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-[#53C7C0]/10 transition-all duration-500 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={400 + index * 100}
              >
                <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg inline-block`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl text-[#243635] mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <button 
              onClick={() => navigate(isAuth ? '/editor' : '/register')}
              className="group bg-gradient-to-r from-[#243635] to-[#53C7C0] hover:from-[#53C7C0] hover:to-[#243635] text-white px-8 py-4 rounded-2xl shadow-lg shadow-[#53C7C0]/25 hover:shadow-xl hover:shadow-[#53C7C0]/40 transition-all duration-500 font-semibold text-lg flex items-center gap-3 hover:-translate-y-1"
            >
              <Feather className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Writing
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => articlesRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-[#243635] rounded-2xl font-semibold text-lg border-2 border-[#53C7C0]/20 hover:border-[#53C7C0] hover:bg-[#53C7C0]/5 transition-all duration-300 flex items-center gap-3 hover:-translate-y-1"
            >
              <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              Explore Articles
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main ref={articlesRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {/* Popular Tags Section */}
          <section 
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-300/20 border border-white/60 overflow-hidden"
            data-aos="fade-up"
          >
            <div className="bg-gradient-to-r from-[#243635] via-[#53C7C0] to-[#243635] px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                  <Hash className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Popular Tags</h2>
                  <p className="text-white/90 text-sm">Discover trending topics in our community</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <PopularTags onTagClick={onTagClick} />
            </div>
          </section>

          {/* Articles Section */}
          <section 
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-300/20 border border-white/60 overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="p-8">
              {/* Feed Toggle */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {isAuth && (
                  <button
                    onClick={onFeedClick}
                    className={classNames(
                      "group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5",
                      filters.feed
                        ? "bg-gradient-to-r from-[#243635] to-[#53C7C0] text-white shadow-lg shadow-[#53C7C0]/20"
                        : "bg-white/80 text-[#243635] border-2 border-gray-200 hover:border-[#53C7C0] hover:bg-[#53C7C0]/5"
                    )}
                  >
                    <Users className="w-5 h-5" />
                    <span>Your Feed</span>
                    {filters.feed && <Star className="w-4 h-4 animate-pulse" />}
                  </button>
                )}

                <button
                  onClick={onGlobalFeedClick}
                  className={classNames(
                    "group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5",
                    !filters.feed && !filters.tag
                      ? "bg-gradient-to-r from-[#243635] to-[#53C7C0] text-white shadow-lg shadow-[#53C7C0]/20"
                      : "bg-white/80 text-[#243635] border-2 border-gray-200 hover:border-[#53C7C0] hover:bg-[#53C7C0]/5"
                  )}
                >
                  <Globe className="w-5 h-5" />
                  <span>Global Feed</span>
                  {!filters.feed && !filters.tag && <Star className="w-4 h-4 animate-pulse" />}
                </button>

                {filters.tag && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] text-white rounded-2xl font-semibold shadow-lg">
                    <Hash className="w-5 h-5" />
                    <span>{filters.tag}</span>
                    <Trophy className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Stats Bar
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-[#53C7C0]/10 to-[#53C7C0]/5 rounded-2xl p-4 border border-[#53C7C0]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Writers</p>
                      <p className="text-2xl font-bold text-[#243635]">2.5K+</p>
                    </div>
                    <PenTool className="w-8 h-8 text-[#53C7C0]" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#243635]/10 to-[#243635]/5 rounded-2xl p-4 border border-[#243635]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Articles Today</p>
                      <p className="text-2xl font-bold text-[#243635]">150+</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-[#243635]" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#53C7C0]/10 to-[#243635]/10 rounded-2xl p-4 border border-[#53C7C0]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Reads</p>
                      <p className="text-2xl font-bold text-[#243635]">500K+</p>
                    </div>
                    <Eye className="w-8 h-8 text-[#53C7C0]" />
                  </div>
                </div>
              </div> */}

              {/* Article List */}
              <div className="relative">
                <ArticleList filters={filters} />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
