import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import ForgotPassword from '../../components/authenticate_components/ForgotPassword';

export default function ForgotPasswordPage() {
    return (
        <>
            <Navbar title="Forgot Password" />
            {/* <PageHeader title="Forgot Password" readOnly /> */}
            <ForgotPassword />
            <Footer />
        </>
    )
}