import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import Booking from '../../components/user-components/Booking';

export default function BookingPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Đặt lịch" readOnly />
            <Booking />
            <Footer />
        </>
    )
}