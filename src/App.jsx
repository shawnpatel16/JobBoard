import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load last visited info from localStorage
    const lastVisitedInfo = JSON.parse(
      localStorage.getItem("lastVisited") || "{}"
    );

    fetch("/bookmarks.json")
      .then((response) => response.json())
      .then((data) => {
        const enrichedData = data.map((bookmark) => ({
          ...bookmark,
          lastVisited: lastVisitedInfo[bookmark.companyName] || null,
        }));
        const sortedData = enrichedData.sort((a, b) =>
          a.companyName.localeCompare(b.companyName)
        );
        setBookmarks(sortedData);
        setFilteredBookmarks(sortedData);
      });
  }, []);

  useEffect(() => {
    setFilteredBookmarks(
      bookmarks.filter((bookmark) =>
        bookmark.companyName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, bookmarks]);

  const visitBookmark = (index) => {
    const now = new Date().toLocaleString();
    const newBookmarks = [...bookmarks];
    newBookmarks[index].lastVisited = now;

    // Save last visited info to localStorage
    const lastVisitedInfo = JSON.parse(
      localStorage.getItem("lastVisited") || "{}"
    );
    lastVisitedInfo[newBookmarks[index].companyName] = now;
    localStorage.setItem("lastVisited", JSON.stringify(lastVisitedInfo));

    setBookmarks(newBookmarks);
    window.open(newBookmarks[index].link, "_blank");
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="container">
      <input
        type="text"
        className="form-control mt-3"
        placeholder="Search for a company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mt-3">
        {filteredBookmarks.map((bookmark, index) => (
          <div
            key={index}
            className="card mb-1"
            style={{ cursor: "pointer" }}
            onClick={() => visitBookmark(index)}
          >
            <div className="card-body p-2">
              <h5 className="card-title m-0">
                {index + 1}. {capitalizeFirstLetter(bookmark.companyName)}
              </h5>
              <small className="text-muted">
                {bookmark.lastVisited
                  ? `Last visited: ${bookmark.lastVisited}`
                  : "Not visited yet"}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
