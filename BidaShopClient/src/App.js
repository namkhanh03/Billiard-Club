import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import Authen
import SignIn from './pages/authenticate_pages/SignInPage';
import SignUp from './pages/authenticate_pages/SignUpPage';
import ForgotPassword from './pages/authenticate_pages/ForgotPasswordPage';
import ResetPassword from './pages/authenticate_pages/ResetPasswordPage';

// Import Home Page
import HomePage from './pages/user-pages/HomePage';
import BlogPage from './pages/user-pages/BlogPage';
import BlogDetailPage from './pages/user-pages/BlogDetailPage';
import ContactPage from './pages/user-pages/ContactPage';
import SignContractPage from './pages/user-pages/SignContractPage';

// Import User Page
import UserProfilePage from './pages/user-pages/UserProfilePage';
import FacilityDetailPage from './pages/user-pages/FacilityDetailPage';
import FacilitiesListPage from './pages/user-pages/FacilitiesListPage';

import UserHistoryPage from './pages/user-pages/UserHistoryPage';
import BookingPage from './pages/user-pages/BookingPage';
import ChangePasswordPage from './pages/user-pages/ChangePasswordPage';

function App() {
	return (
		<div className='app'>
			<div className='content'>
				<Routes>
					{/* Authen Router */}
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/forgotpassword' element={<ForgotPassword />} />
					<Route path='/reset-password' element={<ResetPassword />} />
					{/* Home Page Router */}
					<Route path='/' element={<HomePage />} />
					<Route path='/blog' element={<BlogPage />} />
					<Route path='/blog/:blogId' element={<BlogDetailPage />} />
					<Route path='/contact' element={<ContactPage />} />
					<Route path='/contract/:id' element={<SignContractPage />} />

					{/* User Router */}
					<Route path='/userProfile' element={<UserProfilePage />} />
					<Route path='/change-password' element={<ChangePasswordPage />} />
					<Route path='/list-facility' element={<FacilitiesListPage />} />
					<Route path='/booking' element={<BookingPage />} />
					<Route path='/facilities/:id' element={<FacilityDetailPage />} />

					<Route path='/history' element={<UserHistoryPage />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
