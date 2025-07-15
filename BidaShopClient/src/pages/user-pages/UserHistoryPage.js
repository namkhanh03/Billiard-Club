import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import PageHeader from '../../components/user-components/PageHeader';
import Footer from '../../components/user-components/Footer';
import UserHistory from '../../components/user-components/UserHistory';


export default function UserHistoryPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Lịch sử chơi" readOnly />
            <UserHistory />
            <Footer />
        </>
    )
}
