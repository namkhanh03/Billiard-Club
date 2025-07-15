import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import SignContract from '../../components/user-components/SignContract';


export default function SignContractPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Ký hợp đồng" readOnly />
            <SignContract />
            <Footer />
        </>
    )
}
