import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CourseList.module.css';

const RecommendedCourses = () => {

    const navigate = useNavigate();
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/courses/RecommendedCourses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                setRecommendedCourses(response.data.recommendedCourses);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedCourses();
    }, []);

    const handleNavigateToDetail = (courseId) => {
        setIsNavigating(true);
        navigate(`/course/${courseId}`);
    };

    if (loading) return null;
    if (error || recommendedCourses.length === 0) return null;

    const calculateDiscountedPrice = (price, discount) => {
        if (!price || !discount) return price;
        const discountedPrice = price - (price * discount) / 100;
        return discountedPrice;
    };

    return (
        <div className={styles.recommendedCoursesContainer}>
            <h2 className={styles.coursesTitle}>Khoá học được đề xuất</h2>
            <div className={styles.coursesGrid}>
                {recommendedCourses.map((course, index) => (
                    <div key={course._id} className={`${styles.courseCard} ${styles[`priority${index + 1}`]}`}>
                        <div className={styles.badgeWrapper}>
                            {index === 0 && (
                                <div className={`${styles.badge} ${styles.goldBadge}`}>
                                    <i className="fas fa-crown"></i>
                                    <span>Lựa Chọn Phù Hợp Nhất</span>
                                </div>
                            )}
                            {index === 1 && (
                                <div className={`${styles.badge} ${styles.silverBadge}`}>
                                    <i className="fas fa-award"></i>
                                    <span>Lựa chọn 2</span>
                                </div>
                            )}
                            {index === 2 && (
                                <div className={`${styles.badge} ${styles.bronzeBadge}`}>
                                    <i className="fas fa-medal"></i>
                                    <span>Lựa chọn 3</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.courseContent}>
                            <img
                                className={styles.courseImage}
                                src={`${course.image}`}
                                alt={course.name}
                            />

                            <div className={styles.courseInfo}>
                                <div className={styles.courseCategory}>
                                    {course.category?.category || "Chưa phân loại"}
                                </div>

                                <h2 className={styles.courseName}>{course.name}</h2>

                                <div className={styles.courseCoach}>
                                    {course.coachId ? (
                                        <>
                                            <img
                                                src={course.coachId.avatar || '/default-avatar.png'}
                                                alt={course.coachId.name}
                                                className={styles.coachAvatar}
                                            />
                                            <Link
                                                to={`/coach/${course.coachId.coachId}`}
                                                className={styles.coachLink}
                                            >
                                                {course.coachId.name}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-user"></i>
                                            <span>Chưa có</span>
                                        </>
                                    )}
                                </div>

                                <div className={styles.priceSection}>
                                    {course.price ? (
                                        <div className={styles.priceRow}>
                                            <span className={styles.newPrice}>
                                                {course.discount > 0
                                                    ? `${calculateDiscountedPrice(course.price, course.discount).toLocaleString()} vnđ`
                                                    : `${course.price.toLocaleString()} vnđ`}
                                            </span>
                                            {course.discount > 0 && (
                                                <>
                                                    <span className={styles.oldPrice}>
                                                        {course.price.toLocaleString()} vnđ
                                                    </span>
                                                    <span className={styles.courseDiscountSpan}>
                                                        -{course.discount}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <span>Chưa có giá</span>
                                    )}

                                    <button
                                        onClick={() => handleNavigateToDetail(course._id)}
                                        className={styles.detailsBtn}
                                    >
                                        Xem Chi Tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedCourses; 