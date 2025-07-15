import React, { useEffect, useState, useCallback } from "react";
import {
    Modal,
    Row,
    Col,
    message,
    Space,
    Button,
    notification,
    DatePicker,
} from "antd";
import moment from "moment";
import { PrinterOutlined, DollarOutlined, SaveOutlined, SearchOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Logo from "assets/img/updated_bida_logo_no_bg.png";
import LeftForm from "./LeftForm";
import OrderSummary from "./OrderSummary";
import {
    getTempTableSessionByTableId,
    createTempTableSession,
    updateTempTableSession,
    updatePrintCount
} from "services/tempTableSessionService";
import { getAllUsers } from "services/userService";
import { getAllDrinkFoods } from "services/drinkFoodService";
import { changeBilliardTableStatus } from "services/billiardTableService";
import { formatCurrency } from "utils/formatCurrency";
import { checkPayment, createOrder } from "services/orderService";

const TableReservationModal = ({ open, onClose, table, fetchTables }) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [customerPhone, setCustomerPhone] = useState(null);
    const [menu, setMenu] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orderedItems, setOrderedItems] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [printCount, setPrintCount] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);

    const fetchMenu = useCallback(async () => {
        try {
            const res = await getAllDrinkFoods(1, 100, "", null, table?.facility?.id);
            setMenu(res.content);
        } catch {
            message.error("Không thể lấy danh sách món.");
        }
    }, [table?.facility?.id]);

    const fetchCustomers = useCallback(async () => {
        try {
            const res = await getAllUsers(1, 100, "", "CUSTOMER");
            setCustomers(res.content);
        } catch {
            message.error("Không thể lấy danh sách khách hàng.");
        }
    }, []);

    const loadSessionData = useCallback(async () => {
        try {
            const session = await getTempTableSessionByTableId(table?.id);
            if (session) {
                setSessionId(session.id);

                const start = session.startTime ? moment(session.startTime) : null;
                const end = session.endTime ? moment(session.endTime) : null;

                setStartDate(start);
                setEndDate(end);
                setStartTime(start);
                setEndTime(end);
                setCustomerPhone(session.customerPhone);
                setPrintCount(session.printCount)
                setOrderedItems(
                    session.drinks?.map((item) => ({
                        id: item.drink.id,
                        name: item.drink.name,
                        price: item.drink.price,
                        priceAtThatTime: item.priceAtThatTime,
                        image: item.drink.image,
                        quantity: item.quantity,
                    })) || []
                );
            }
        } catch {
            setSessionId(null);
        }
    }, [table?.id]);

    useEffect(() => {
        if (open && table) {
            fetchMenu();
            fetchCustomers();
            loadSessionData();
        }
    }, [open, table, fetchMenu, fetchCustomers, loadSessionData]);
    const handleCheckTransfer = async () => {
        try {
            const response = await checkPayment();

            // Response đã là object JavaScript, không cần parse JSON
            const json = response;

            // Kiểm tra cấu trúc response
            if (!json || typeof json !== 'object' || !Array.isArray(json.data)) {
                return notification.error({ message: "Dữ liệu không hợp lệ" });
            }

            const finalEndTime = endTime;
            const foodDrinkTotal = orderedItems.reduce(
                (sum, item) => sum + item.quantity * (item.priceAtThatTime || item.price),
                0
            );
            const { total: tableCharge } = calculateTableCharge(startTime, finalEndTime, table?.pricing?.pricingDetails);
            const grandTotal = foodDrinkTotal + tableCharge;

            // Tìm giao dịch phù hợp
            const matched = json.data.find(item =>
                item["Mô tả"]?.includes(`hoa don ${sessionId}`) &&
                Number(item["Giá trị"]) === grandTotal
            );

            if (matched) {
                notification.success({
                    message: "Đã nhận được chuyển khoản",
                    description: `Giao dịch hợp lệ với mã GD: ${matched["Mã GD"]}`,
                });
                handlePaymentMethod("Chuyển khoản");
                fetchTables();
                onClose();
                resetForm();
            } else {
                notification.warning({
                    message: "Chưa thấy giao dịch phù hợp",
                    description: `Vui lòng kiểm tra lại nội dung chuyển khoản và số tiền.`,
                });
            }

        } catch (err) {
            console.error("Lỗi khi kiểm tra chuyển khoản:", err);
            notification.error({
                message: "Lỗi khi kiểm tra",
                description: err.message || "Không thể kết nối đến server hoặc lỗi định dạng dữ liệu.",
            });
        }
    };


    const handleSave = async (check) => {
        if (!startTime) {
            return notification.warning({
                message: "Thiếu thông tin",
                description: "Vui lòng chọn giờ bắt đầu.",
            });
        }

        // Nếu startDate và endDate hợp lệ, tạo thời gian đầy đủ
        const fullStart = moment(startDate)
            .set({
                hour: startTime.hour(),
                minute: startTime.minute(),
            })
            .toISOString();

        const fullEnd = moment(endTime)
            .toISOString();


        const sessionData = {
            tableId: table.id,
            customerPhone: customerPhone,
            startTime: fullStart,
            endTime: fullEnd,
            status: "ACTIVE",
            drinks: orderedItems.map((item) => ({
                drinkId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
            })),
        };

        try {
            if (sessionId) {
                await updateTempTableSession(sessionId, sessionData);
                if (!check) {
                    notification.success({
                        message: "Cập nhật thành công",
                        description: `Bàn ${table.name} đã được cập nhật.`,
                    });
                }
            } else {
                await createTempTableSession(sessionData);
                notification.success({
                    message: "Mở bàn thành công",
                    description: `Bàn ${table.name} đã được mở.`,
                });
            }

            await changeBilliardTableStatus(table.id, "In Use");
            fetchTables();
        } catch (err) {
            notification.error({
                message: "Lỗi",
                description:
                    err.response?.data?.message || "Lỗi khi lưu thông tin bàn.",
            });
        }
    };

    const calculateTableCharge = (start, end, pricingDetails) => {
        if (!start || !end || !pricingDetails || pricingDetails.length === 0)
            return { total: 0, slotDetails: [] };

        const startTime = moment(start);
        const endTime = moment(end);
        let total = 0;
        const slotUsage = {};

        let current = startTime.clone();

        while (current.isBefore(endTime)) {
            const next = moment.min(current.clone().add(1, "minute"), endTime);
            const hour = current.hour();

            const matchedSlot = pricingDetails.find((slot) => {
                const [from, to] = slot.timeSlot.split(" - ").map(t => parseInt(t));
                return hour >= from && hour < to;
            });

            if (matchedSlot) {
                const durationMinutes = next.diff(current, 'minutes');
                const portion = durationMinutes / 60;
                const hourlyRate = matchedSlot.price;

                total += hourlyRate * portion;

                // Ghi lại số giờ sử dụng trong từng slot
                if (!slotUsage[matchedSlot.timeSlot]) {
                    slotUsage[matchedSlot.timeSlot] = 0;
                }
                slotUsage[matchedSlot.timeSlot] += portion;
            }

            current.add(1, "minute");
        }

        const slotDetails = Object.entries(slotUsage).map(([slot, hours]) => ({
            timeSlot: slot,
            hours: parseFloat(hours.toFixed(2)),
        }));

        return {
            total: Math.round(total),
            slotDetails,
        };
    };
    const handlePrint = async () => {
        if (!sessionId) {
            return notification.warning({
                message: "Thông báo",
                description: "Không tìm thấy thông tin bàn để in hóa đơn.",
            });
        }


        // Kiểm tra lại fullEnd có null không
        if (!endTime) {
            return notification.warning({
                message: "Lỗi",
                description: "Chọn giờ kết thúc trước khi in.",
            });
        }
        // Nếu endTime không có, lấy thời gian hiện tại
        const finalEndTime = endTime;

        // Tính tổng tiền các món
        const foodDrinkTotal = orderedItems.reduce(
            (sum, item) => sum + item.quantity * (item.priceAtThatTime || item.price),
            0
        );

        // Tính tiền bàn theo thời gian
        const { total: tableCharge, slotDetails } = calculateTableCharge(startTime, finalEndTime, table?.pricing?.pricingDetails);

        // Tổng tiền
        const grandTotal = foodDrinkTotal + tableCharge;

        // Tạo mã QR thanh toán
        const qrCodeUrl = `https://img.vietqr.io/image/MB-0915327598-compact.png?amount=${grandTotal}&addInfo=Thanh toan hoa don ${sessionId}`;

        // Gọi API để cập nhật số lần in
        try {
            setPrintCount(printCount + 1);
            await updatePrintCount(sessionId);  // Call API để cập nhật số lần in
        } catch (error) {
            console.error("Lỗi khi cập nhật số lần in:", error);
        }

        // Tạo nội dung hóa đơn với thiết kế đẹp hơn
        const invoiceContent = `
        <div style="font-family: Arial, sans-serif; width: 100%; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            
            <!-- Logo và thông tin cửa hàng -->
            <div style="text-align: center; margin-bottom: 20px;">
                <img src=${Logo} alt="Logo" style="width: 120px; height: auto;" />
                <h2 style="margin: 0;">BILLIARD CLUB</h2>
                <p style="margin: 5px 0;">Địa chỉ: ${table.facility.address}</p>
                <p style="margin: 5px 0;">SĐT: ${table.facility.phoneNumber}</p>
            </div>
            
            <h3 style="text-align: center; margin-bottom: 20px;">HÓA ĐƠN BÁN HÀNG</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 8px; font-weight: bold; width: 50%;">Chi nhánh:</td>
                    <td style="padding: 8px;">${table.facility.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; width: 50%;">Bàn:</td>
                    <td style="padding: 8px;">${table.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Giờ vào:</td>
                    <td style="padding: 8px;">${moment(startTime).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Giờ kết thúc:</td>
                    <td style="padding: 8px;">${moment(endTime).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Số lần in:</td>
                    <td style="padding: 8px;">${printCount + 1 || 0}</td>
                </tr>
            </table>
    
            <h3>Danh sách món:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f1f1f1;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Món</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Số lượng</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Đơn giá</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderedItems.map(item => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(item.price)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency((item.quantity * item.price))}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <!-- Hiển thị tổng tiền cùng một hàng -->
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
    <div style="width: 48%; font-weight: bold;">Số giờ chơi:</div>
    <div style="width: 48%; text-align: right; font-size: 18px;">
        ${moment(finalEndTime).diff(moment(startTime), 'minutes')} phút
    </div>
</div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div style="width: 48%; font-weight: bold;">Tổng tiền món ăn/uống:</div>
                <div style="width: 48%; text-align: right; font-size: 18px;">${formatCurrency(foodDrinkTotal)}</div>
            </div>
    
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <div style="width: 48%; font-weight: bold;">Tổng tiền sử dụng bàn:</div>
                <div style="width: 48%; text-align: right; font-size: 18px;">${formatCurrency(tableCharge)}</div>
            </div>
            <!-- Bảng tổng cộng -->
            <div style="margin-top: 20px;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; width: 50%;">Tổng cộng:</td>
                        <td style="padding: 8px; text-align: right; font-size: 18px;"><strong>${formatCurrency(grandTotal)}</strong></td>
                    </tr>
                </table>
            </div>
    
            <!-- Mã QR thanh toán -->
            <div style="text-align: center; margin-top: 20px;">
                <img src="${qrCodeUrl}" alt="QR Code thanh toán" style="width: 250px;" />
            </div>
    
            <p style="margin-top: 20px; text-align: center; font-size: 14px; font-style: italic;">Cảm ơn Quý khách. Hẹn gặp lại!</p>
        </div>
    `;

        // Tạo cửa sổ mới để in hóa đơn
        const printWindow = window.open("", "_blank", "width=600,height=800");
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    const handleCheckout = () => {
        // Kiểm tra các thông tin cần thiết trước khi gọi API
        if (!startTime || !endTime) {
            return notification.warning({
                message: "Thiếu thông tin",
                description: "Vui lòng kiểm tra lại thông tin khách hàng, phương thức thanh toán, và thời gian.",
            });
        }

        // Nếu có nhập số điện thoại thì phải đúng định dạng
        if (customerPhone && !/^0\d{9}$/.test(customerPhone)) {
            return notification.warning({
                message: "Số điện thoại không hợp lệ",
                description: "Số điện thoại phải bắt đầu bằng 0 và đủ 10 số.",
            });
        }

        handleSave(true);
        setPaymentModalVisible(true);
    };


    const handlePaymentMethod = async (method) => {
        try {
            const finalEndTime = endTime;

            // Tính tổng tiền các món
            const foodDrinkTotal = orderedItems.reduce(
                (sum, item) => sum + item.quantity * (item.priceAtThatTime || item.price),
                0
            );

            // Tính tiền bàn theo thời gian
            const { total: tableCharge, slotDetails } = calculateTableCharge(startTime, finalEndTime, table?.pricing?.pricingDetails);

            // Tổng tiền
            const grandTotal = foodDrinkTotal + tableCharge;
            // Gọi API tạo đơn hàng
            await createOrder(sessionId, method, grandTotal, moment(finalEndTime).diff(moment(startTime), 'minutes'), customerPhone);
            await changeBilliardTableStatus(table.id, "Available");
            notification.success({
                message: "Thành công",
                description: `Thanh toán thành công với phương thức thanh toán: ${method}`,
            });

            // Cập nhật trạng thái của bàn
            fetchTables();
            onClose();
        } catch (err) {
            notification.error({
                message: "Lỗi",
                description: "Lỗi khi tạo đơn hàng, vui lòng thử lại.",
            });
        } finally {
            // Đóng modal chọn phương thức thanh toán
            setPaymentModalVisible(false);
        }
    };
    const resetForm = () => {
        setStartTime(null);
        setEndTime(null);
        setStartDate(moment());
        setEndDate(moment());
        setCustomerPhone(null);
        setOrderedItems([]);
        setSessionId(null);
    };
    const getPaymentMethodStyle = (method) => ({
        border: paymentMethod === method ? "2px solid #3399ff" : "1px solid #ccc", // Viền đổi màu khi chọn
        padding: "16px",
        borderRadius: "8px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        margin: "8px",
        width: "150px",   // Kích thước cố định cho width
        height: "150px",  // Kích thước cố định cho height
    });

    return (
        <>

            <Modal
                title={`Đặt bàn: ${table?.name}`}
                open={open}
                onCancel={() => {
                    resetForm();
                    onClose();
                }}
                footer={
                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                        <div>
                            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                                In hóa đơn
                            </Button>
                            <Button
                                icon={<DollarOutlined />}
                                type="primary"
                                danger
                                style={{ marginLeft: 8 }}
                                onClick={handleCheckout}
                            >
                                Thanh toán
                            </Button>
                        </div>
                        <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(false)}>
                            Lưu
                        </Button>
                    </Space>
                }
                width={1200}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <LeftForm
                            customers={customers}
                            customerPhone={customerPhone}
                            setCustomerPhone={setCustomerPhone}
                            startTime={startTime}
                            endTime={endTime}
                            setStartTime={setStartTime}
                            setEndTime={setEndTime}
                            menu={menu}
                            orderedItems={orderedItems}
                            setOrderedItems={setOrderedItems}
                        />
                    </Col>
                    <Col span={12}>
                        <OrderSummary
                            table={table}
                            orderedItems={orderedItems}
                            setOrderedItems={setOrderedItems}
                            startTime={startTime}
                            endTime={endTime}
                            menu={menu}
                        />
                    </Col>
                </Row>
            </Modal>
            <Modal
                title="Chọn phương thức thanh toán"
                visible={paymentModalVisible}
                onCancel={() => setPaymentModalVisible(false)}
                footer={[
                    <Button
                        key="check"
                        type="default"
                        icon={<SearchOutlined />}
                        onClick={handleCheckTransfer}
                        style={{
                            fontWeight: 600,
                            color: "#1890ff",
                            borderColor: "#1890ff",
                            backgroundColor: "#e6f7ff",
                        }}
                    >
                        Kiểm tra chuyển khoản
                    </Button>,
                    <Button
                        key="pay"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handlePaymentMethod(paymentMethod)}
                        disabled={!paymentMethod}
                        style={{
                            fontWeight: 600,
                            color: "#52c41a",
                            borderColor: "#52c41a",
                            backgroundColor: "#f6ffed", // xanh lá nhạt
                        }}
                    >
                        Xác nhận thanh toán
                    </Button>,
                ]}
                width={700}
            >
                <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
                    {/* Phương thức thanh toán "Chuyển khoản" */}
                    <div
                        style={getPaymentMethodStyle("Chuyển khoản")}
                        onClick={() => setPaymentMethod("Chuyển khoản")}
                    >
                        <img
                            src="https://img.lovepik.com/element/40038/1940.png_860.png" // Cập nhật với icon thực tế
                            alt="Chuyển khoản"
                            style={{ width: 70, height: 70, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Chuyển khoản</div>
                    </div>

                    {/* Phương thức thanh toán "Tiền mặt" */}
                    <div
                        style={getPaymentMethodStyle("Tiền mặt")}
                        onClick={() => setPaymentMethod("Tiền mặt")}
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/9590/9590121.png" // Cập nhật với icon thực tế
                            alt="Tiền mặt"
                            style={{ width: 70, height: 70, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Tiền mặt</div>
                    </div>

                    {/* Phương thức thanh toán "Khác" */}
                    <div
                        style={getPaymentMethodStyle("Khác")}
                        onClick={() => setPaymentMethod("Khác")}
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/16993/16993968.png" // Cập nhật với icon thực tế
                            alt="Khác"
                            style={{ width: 70, height: 70, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Khác</div>
                    </div>
                </Space>
            </Modal>
        </>

    );
};

export default TableReservationModal;
