import classNames from "classnames";
import React from "react";
import { ArticleList, PopularTags } from "../components";
import { useArticlesQuery, useAuth } from "../hooks";
import "./Home.css";
import bannerImage from "../assets/banner.png";

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

  return (
    <div
      className="container home-page"
      style={{
        maxWidth: "1220px",
        margin: "0 auto",
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
          <h1 className="logo-font">Blogging</h1>
          <p>A place to share your knowledge.</p>
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
  );
}

export default Home;
