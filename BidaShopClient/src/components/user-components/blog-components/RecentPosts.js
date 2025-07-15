import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

function RecentPosts({ recentPosts }) {
  return (
    <div>
      <div className="flex flex-col gap-6">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col sm:flex-row items-center gap-4 bg-gray-800 p-4 rounded-lg hover:shadow-lg transition-shadow"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full sm:w-32 h-32 rounded-md object-cover shadow-md"
            />
            <div className="flex-1" >
              <p className="text-xs text-gray-400 mb-0.5" style={{ display: "inline-flex" }}>
                <FaCalendarAlt style={{ marginRight: '4px', color: '##232323' }} /> {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <h4 className="text-lg font-semibold mb-2 text-white"
              >
                {post.title.length > 40
                  ? post.title.slice(0, 40) + "..."
                  : post.title}
              </h4>
              <Link
                to={`/blog/${post.id}`}
                className="text-orange-500 hover:text-orange-400 text-sm no-underline"
              >
                Xem tiếp →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentPosts;
