import classNames from "classnames";
import React from "react";
import { ArticleList, PopularTags } from "../components";
import { useArticlesQuery, useAuth } from "../hooks";
import './Home.css';

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
    <div className="home-page">
      <div className="banner" style={{ backgroundColor: "#243635", important: true, borderRadius: '25px' }}>
        <div className="container" style={{ padding: '40px'}}>
          <h1 className="logo-font">Blogging</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
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
            <ArticleList />
          </div>
          <div className="col-md-3">
            <PopularTags />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
