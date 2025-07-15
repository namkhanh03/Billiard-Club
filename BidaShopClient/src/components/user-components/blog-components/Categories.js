import React, { useState, useEffect } from "react";
import axios from "axios";

const btnStyles = `self-start font-medium transition-all hover:text-red-500 hover:bg-transparent`;

function Categories({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categoryBlogsMap, setCategoryBlogsMap] = useState({});
  const [totalBlogs, setTotalBlogs] = useState(0); // State to track the total number of blogs

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/blogCategory"
      );
      setCategories(response.data.blogCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/blogs");
      setBlogs(response.data);
      setTotalBlogs(response.data.length);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Map categories to blogs for quick look-up
  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Map blog categories and count the number of blogs for each category
    const map = {};
    blogs.forEach((blog) => {
      if (blog.category) {
        const catName = blog.category.catName;
        if (map[catName]) {
          map[catName] += 1;
        } else {
          map[catName] = 1;
        }
      }
    });
    setCategoryBlogsMap(map);
  }, [blogs]);

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100"
      style={{ backgroundColor: "#151515" }}
    >
      <button
        className={btnStyles}
        onClick={() => onCategorySelect(null)}
        disabled={false} // Always enabled for "All Categories"
      >
        &rsaquo; Tất cả Blogs ({totalBlogs}) {/* Display total blog count */}
      </button>
      {categories.map((category) => {
        const blogCount = categoryBlogsMap[category.catName] || 0;
        const isCategoryDisabled = blogCount === 0;

        return (
          <button
            key={category._id}
            className={`${btnStyles} ${isCategoryDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            onClick={() =>
              !isCategoryDisabled && onCategorySelect(category.catName)
            }
            disabled={isCategoryDisabled} // Disable if no blogs are available
          >
            &rsaquo; {category.catName}
            {blogCount > 0 && ` (${blogCount})`} {/* Show blog count if > 0 */}
          </button>
        );
      })}
    </div>
  );
}

export default Categories;
