import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import PageHeader from '../../components/user-components/PageHeader';
import Footer from '../../components/user-components/Footer';
import ChangePassword from '../../components/user-components/ChangePassword';


export default function ChangePasswordPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Thông tin người dùng" readOnly />
            <ChangePassword />
            <Footer />
        </>
    )
}
