import React, { useEffect, useState } from "react";
import { Modal, Table, Checkbox, message, Spin, Image } from "antd";
import { getAllFacilities } from "services/facilityService"; // API lấy danh sách chi nhánh
import { updateUserManageFacility, getFacilityByUser } from "services/facilityUserService"; // API cập nhật & lấy danh sách quản lý

const UpdateUserFacilityModal = ({ visible, onCancel, userId, refreshUsers }) => {
    const [facilities, setFacilities] = useState([]); // Danh sách tất cả chi nhánh
    const [selectedFacilities, setSelectedFacilities] = useState([]); // Danh sách chi nhánh user đang quản lý
    const [loading, setLoading] = useState(false);

    // Lấy danh sách chi nhánh & kiểm tra chi nhánh user đang quản lý
    useEffect(() => {
        if (visible && userId) {
            setLoading(true);
            Promise.all([getAllFacilities(1, 100), getFacilityByUser(userId)])
                .then(([allFacilities, userFacilities]) => {
                    // Lọc danh sách chi nhánh hợp lệ
                    const facilityList = allFacilities.content || [];
                    setFacilities(facilityList);

                    // Lấy danh sách ID của chi nhánh mà user đang quản lý
                    const userFacilityIds = new Set(userFacilities.map(facility => facility.id));

                    // Chỉ chọn những chi nhánh mà user đã có quyền quản lý
                    const selected = facilityList
                        .filter(facility => userFacilityIds.has(facility.id))
                        .map(facility => facility.id);

                    setSelectedFacilities(selected);
                })
                .catch((err) => console.error("Lỗi khi lấy danh sách chi nhánh:", err))
                .finally(() => setLoading(false));
        }
    }, [visible, userId]);

    // Xử lý cập nhật danh sách chi nhánh user quản lý
    const handleUpdate = async () => {
        try {
            await updateUserManageFacility(userId, selectedFacilities);
            message.success("Cập nhật chi nhánh thành công!");
            refreshUsers();
            onCancel();
        } catch (error) {
            message.error("Lỗi khi cập nhật chi nhánh.");
        }
    };

    // Cấu hình bảng chi nhánh
    const columns = [
        {
            title: "Tên Chi Nhánh",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Địa Chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Hình Ảnh",
            dataIndex: "images",
            key: "image",
            render: (images) => {
                const firstImage = images && images.length > 0 ? images[0].imageUrl : "https://via.placeholder.com/80";
                return (
                    <Image
                        src={firstImage}
                        alt="Facility"
                        width={80}
                        height={80}
                        style={{ borderRadius: "10%" }}
                    />
                );
            },
        },
        {
            title: "Chọn",
            dataIndex: "id",
            key: "select",
            render: (id) => (
                <Checkbox
                    checked={selectedFacilities.includes(id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedFacilities([...selectedFacilities, id]);
                        } else {
                            setSelectedFacilities(selectedFacilities.filter(facilityId => facilityId !== id));
                        }
                    }}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Cập Nhật Chi Nhánh Quản Lý"
            visible={visible}
            onCancel={onCancel}
            onOk={handleUpdate}
            okText="Cập Nhật"
            cancelText="Hủy"
            width={800}
        >
            {loading ? (
                <div style={{ textAlign: "center" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={facilities}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            )}
        </Modal>
    );
};

export default UpdateUserFacilityModal;
