import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import FacilitiesList from '../../components/user-components/FacilitiesList';

export default function FacilitiesListPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Danh sách chi nhánh" readOnly />
            <FacilitiesList />
            <Footer />
        </>
    )
}