import classNames from "classnames";
import React,{ useRef, useEffect } from "react";
import { ArticleList, PopularTags, Footer } from "../components";
import { useArticlesQuery, useAuth } from "../hooks";
import "./Home.css";
import bannerImage from "../assets/banner.png";
import Typed from 'typed.js';

const initialFilters = { tag: "", offset: null, feed: false };

function Home() {
  const { isAuth } = useAuth();
  const [filters, setFilters] = React.useState({
    ...initialFilters,
    feed: isAuth,
  });

  React.useEffect(() => {
    setFilters({ ...initialFilters, feed: isAuth });
  }, [isAuth]);

  function onTagClick(tag) {
    setFilters({ ...initialFilters, tag });
  }

  function onGlobalFeedClick() {
    setFilters(initialFilters);
  }

  function onFeedClick() {
    setFilters({ ...initialFilters, feed: true });
  }

  // Create reference for the typed.js element
  const typedElementRef = useRef(null);
  let typedInstance = null;

  // Set up Typed.js
  useEffect(() => {
    if (typedElementRef.current) {
      typedInstance = new Typed(typedElementRef.current, {
        strings: [
          "A place to share your knowledge.",
          "Share Your Wisdom.",
          "Inspire with Words.",
          "Empower Your Voice.",
          "Create & Connect.",
          "Think, Write, Grow.",
          "Ideas Ignite.",
          "Words Matter.",
          "Unleash Passion.",
          "Discover Stories.",
          "Knowledge Unlocked."
        ],
        typeSpeed: 50,
        backSpeed: 80,
        backDelay: 500,
        loop: true,
      });
    }
    
    // Cleanup function
    return () => {
      if (typedInstance) {
        typedInstance.destroy();
      }
    };
  }, []);
  return (
    <>
      <div
        className="container mt-28 home-page"
        style={{
          maxWidth: "1220px",
        }}
      >
        <div
          className="banner"
          style={{
            backgroundColor: "#A8AFAF",
            backgroundImage: `url(${bannerImage})`,
            important: true,
            borderRadius: "25px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div className="" style={{ padding: "40px" }}>
          <h1 className="logo-font">Writely</h1>
            {/* <p>A place to share your knowledge.</p> */}
            <p><span ref={typedElementRef}></span></p>
          </div>
        </div>

        {/* Page Content */}
        <div className="page" style={{ marginTop: "2rem" }}>
          {/* Popular Tags */}
          <div className="feed-toggle">
            <PopularTags onTagClick={onTagClick} />

            {/* Feed buttons */}
            <div className="flex gap-2 mb-4">
              {isAuth && (
                <button
                  onClick={onFeedClick}
                  className={classNames("px-4 py-2 rounded", {
                    "bg-[#001519] text-white": filters.feed,
                    "bg-gray-200 text-gray-700": !filters.feed,
                  })}
                >
                  Your Feed
                </button>
              )}
              {!isAuth && (
                <button
                  onClick={onGlobalFeedClick}
                  className={classNames("px-4 py-2 rounded", {
                    "bg-[#001519] text-white": !filters.feed,
                    "bg-gray-200 text-gray-700": filters.feed,
                  })}
                >
                  Global Feed
                </button>
              )}

              {filters.tag && (
                <button className="px-4 py-2 rounded bg-[#475756] text-white">
                  #{filters.tag}
                </button>
              )}
            </div>
          </div>

          {/* Articles */}
          <ArticleList tag={filters.tag} feed={filters.feed} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
