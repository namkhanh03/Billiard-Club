import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import FacilityDetail from "../../components/user-components/FacilityDetail";

export default function CourseDetailPage() {
  return (
    <>
      <Navbar />
      <PageHeader title="Chi tiết chi nhánh" readOnly />
      <FacilityDetail />
      <Footer />
    </>
  );
}
