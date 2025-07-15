import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import SearchBar from './blog-components/SearchBar';
import RecentPosts from './blog-components/RecentPosts';
import { WarningOutlined } from '@ant-design/icons';

import styles from './blog-components/Blog.module.css';
import { getAllBlogs } from '../../services/blogService';

const Blog = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalBlogs, setTotalBlogs] = useState(0);
	const [recentPosts, setRecentPosts] = useState([]);
	const blogsPerPage = 6;
	const navigate = useNavigate();

	// Debounce search input
	const handleSearch = useCallback(() => {
		const timer = setTimeout(() => {
			setCurrentPage(1);
			setSearchTerm(searchInput);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchInput]);

	useEffect(() => {
		const cleanup = handleSearch();
		return cleanup;
	}, [handleSearch]);

	// Fetch paginated blogs
	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				setLoading(true);
				const response = await getAllBlogs(currentPage, blogsPerPage, searchTerm);
				setBlogs(response.content);
				setTotalBlogs(response.totalElements);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchBlogs();
	}, [currentPage, searchTerm]);

	// Fetch recent posts (3 newest)
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

	const totalPages = Math.ceil(totalBlogs / blogsPerPage);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	if (error) return (
		<div className={styles.errorContainer}>
			<WarningOutlined className={styles.errorIcon} />
			<p className={styles.errorMessage}>Không thể hiển thị danh sách bài viết</p>
			<p className={styles.errorDetail}>
				Vui lòng kiểm tra kết nối mạng và thử lại
				<br />
				Nếu vẫn gặp vấn đề, hãy liên hệ với chúng tôi để được hỗ trợ
			</p>
		</div>
	);

	return (
		<div className={styles.bgGray50}>
			<div className={styles.containerCus}>
				<div className="lg:flex lg:gap-12">
					{/* Main Content */}
					<div className="lg:w-2/3">
						{loading ? (
							<div id="preloder">
								<div className="loader"></div>
							</div>
						) : blogs.length === 0 ? (
							<p className={styles.noPosts}>Không tìm thấy bài viết nào phù hợp.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{blogs.map((blog) => (
									<article key={blog.id} className={`${styles.blogCard}`}>
										<div className={styles.imageWrapper}>
											<img
												src={blog.image}
												alt={blog.title}
												className={styles.blogImage}
											/>
										</div>
										<div className={styles.blogContent}>
											<div className={styles.blogMeta}>
												<div className={styles.icon}>
													<FaUser style={{ marginRight: '8px', color: '#7f8c8d' }} />
													{blog.postedBy?.fullName || 'Unknown'}
												</div>
												<div className={styles.icon}>
													<FaCalendarAlt style={{ marginRight: '8px', color: '#7f8c8d' }} />
													{new Date(blog.createdAt).toLocaleDateString()}
												</div>
											</div>
											<h2 className={styles.blogTitle}>
												{blog.title}
											</h2>
											<div className={styles.readMoreContainer}>
												<button
													onClick={() => navigate(`/blog/${blog.id}`)}
													className={styles.readMore}
												>
													<span>Xem Thêm</span>
													<FaArrowRight style={{ marginLeft: '8px' }} />
												</button>
											</div>
										</div>
									</article>
								))}
							</div>
						)}

						{/* Pagination */}
						{blogs.length > 0 && (
							<div className={styles.pagination}>
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
								>
									Trước
								</button>
								<span className={styles.paginationInfo}>
									Trang {currentPage} / {totalPages}
								</span>
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
								>
									Sau
								</button>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<aside className="lg:w-1/3 mt-12 lg:mt-0">
						<div className="sticky top-24 space-y-8">
							{/* Search */}
							<div className={styles.searchSidebarCard}>
								<h3 className={styles.sidebarTitle}>Tìm Kiếm</h3>
								<SearchBar
									searchInput={searchInput}
									setSearchInput={setSearchInput}
								/>
							</div>

							{/* Recent Posts */}
							<div className={styles.sidebarCard}>
								<h3 className={styles.sidebarTitle}>Bài Viết Mới Nhất</h3>
								<RecentPosts recentPosts={recentPosts} />
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default Blog;
