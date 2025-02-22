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
  const { isArticlesLoading, articles, ArticlesError } = useArticlesQuery();

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
    <div className="container home-page"
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
          textAlign: "center"
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
        <div className="feed-toggle" style={{}}>
          {/* Popular Tags at the top */}
          <PopularTags onTagClick={onTagClick} />

          {/* Feed buttons */}
          <ul className="nav nav-pills">
            {isAuth && (
              <li className="nav-item">
                <button
                  onClick={onFeedClick}
                  type="button"
                  className={classNames("feed-button", {
                    "feed-button-active": filters.feed,
                    "feed-button-inactive": !filters.feed,
                  })}
                >
                  Your Feed
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Articles */}
        <ArticleList />
      </div>
    </div>
  );
}

export default Home;
