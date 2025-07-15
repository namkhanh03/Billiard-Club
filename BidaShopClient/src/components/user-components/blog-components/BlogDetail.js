import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./BlogDetail.module.css";
import RecentPosts from "./RecentPosts";
import { WarningOutlined } from '@ant-design/icons';
import ReactQuill from "react-quill";
import { getAllBlogs, getBlogById } from "../../../services/blogService";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogData = await getBlogById(blogId);

        setBlog(blogData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await getAllBlogs(1, 3, '');
        setRecentPosts(response.content);
      } catch (err) {
        console.error("Error fetching recent posts", err);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <WarningOutlined className={styles.errorIcon} />
        <p className={styles.errorMessage}>Không thể tải nội dung bài viết</p>
        <p className={styles.errorDetail}>
          Vui lòng kiểm tra kết nối mạng và thử lại
          <br />
          Nếu vẫn gặp vấn đề, hãy liên hệ với chúng tôi để được hỗ trợ
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.errorContainer}>
        <WarningOutlined className={styles.errorIcon} />
        <p className={styles.errorMessage}>Không tìm thấy bài viết</p>
        <p className={styles.errorDetail}>
          Bài viết này không tồn tại hoặc đã bị xóa
          <br />
          Vui lòng quay lại trang danh sách bài viết
        </p>
      </div>
    );
  }

  return (
    <div className={styles["blog-detail"]}>
      <div className="lg:flex lg:gap-12">
        <div className="lg:w-2/3">
          <div className={styles["article-header"]}>
            <h1 className={styles["entry-title"]}>{blog.title}</h1>
            <div className={styles["author"]}>
              <div className={styles["author-left"]}>
                <a className={styles["avatar"]} href="#">
                  <img
                    height="60"
                    width="60"
                    src={
                      blog.postedBy?.avatar ||
                      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                    }
                    alt={blog.postedBy?.fullName || "Author"}
                  />
                </a>
                <div className={styles["inner-meta"]}>
                  <span>
                    BY: <a className={styles["created-by"]}>{blog.postedBy?.fullName || "Unknown"}</a>
                  </span>
                </div>
              </div>
              <div className={styles["author-right"]}>
                <p className={styles["created-at"]}>
                  <i className="far fa-calendar-alt" style={{ fontSize: "24px" }}></i>{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className={`${styles["container-fluid"]} ${styles["blog-detail-content"]} ${styles["article-content"]}`}>
            <div
              className={styles["feature-image"]}
              style={{ backgroundImage: `url(${blog.image})` }}
            ></div>

            <div className={styles["blog-detail-paper"]}>
              <div className={`${styles["site-main"]} ${styles["article-text-wrap"]}`}>
                <div
                  className={`${styles["blog-detail-content-2"]} ${styles["text-justify"]}`}
                  dangerouslySetInnerHTML={{
                    __html: blog.content || "",
                  }}
                  style={{ color: "white" }} // Inline style to make all text white
                />

              </div>
            </div>

          </div>
          <ToastContainer />
        </div>

        <aside className="lg:w-1/3 mt-12 lg:mt-0">
          <div className="sticky top-24 space-y-8">
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Bài Viết Mới Nhất</h3>
              <RecentPosts recentPosts={recentPosts} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
