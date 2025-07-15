import React from "react";
import {
    Card,
    Divider,
    InputNumber,
    Button,
    Typography,
    Avatar,
    notification,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const { Text, Title } = Typography;

// ✅ Hàm tính số giờ sử dụng và tiền theo khung giờ
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

const OrderSummary = ({ table, startTime, endTime, orderedItems, setOrderedItems, menu }) => {
    const handleChangeQty = (id, qty) => {
        const menuItem = menu.find((m) => m.id === id);
        const maxQty = menuItem ? menuItem.quantity : 1;

        if (qty > maxQty) {
            notification.warning({
                message: "Không đủ số lượng",
                description: `"${menuItem?.name || ''}" chỉ còn lại ${maxQty} sản phẩm.`,
            });
            // Không cập nhật nếu vượt quá số lượng còn lại
            setOrderedItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, quantity: maxQty } : item
                )
            );
            return;
        }

        setOrderedItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: qty >= 1 ? qty : 1 } : item
            )
        );
    };

    const handleDeleteItem = (id) => {
        setOrderedItems((prev) => prev.filter((item) => item.id !== id));
    };

    // ✅ Tính tiền bàn + thông tin chi tiết theo khung giờ
    const { total: tableCharge, slotDetails } =
        table?.pricing?.pricingDetails && startTime && endTime
            ? calculateTableCharge(startTime, endTime, table.pricing.pricingDetails)
            : { total: 0, slotDetails: [] };

    const foodDrinkTotal = orderedItems.reduce(
        (sum, item) => sum + item.quantity * (item.priceAtThatTime || item.price),
        0
    );

    const grandTotal = foodDrinkTotal + tableCharge;

    return (
        <div
            style={{
                backgroundColor: "#f8f9fa",
                padding: 16,
                borderRadius: 8,
                height: "100%",
                overflowY: "auto",
                maxHeight: "calc(100vh)",
            }}
        >
            <Title level={4}>Món đã chọn</Title>
            {orderedItems.length === 0 ? (
                <Text type="secondary">Chưa có món nào được chọn</Text>
            ) : (
                orderedItems.map((item) => (
                    <Card
                        key={item.id}
                        size="small"
                        style={{
                            marginBottom: 12,
                            borderRadius: 8,
                            backgroundColor: "#fff",
                        }}
                        bodyStyle={{ padding: 12 }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar shape="square" size={48} src={item.image} />
                            <div style={{ flex: 1 }}>
                                <Text strong>{item.name}</Text>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                                    <InputNumber
                                        size="small"
                                        value={item.quantity}
                                        min={1}
                                        onChange={(value) => handleChangeQty(item.id, value)}
                                    />
                                    <Text strong type="success">
                                        {(item.quantity * (item.priceAtThatTime || item.price)).toLocaleString()} ₫
                                    </Text>
                                </div>
                            </div>
                            <Button
                                danger
                                size="small"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteItem(item.id)}
                            />
                        </div>
                    </Card>
                ))
            )}

            <Divider />

            <div style={{ textAlign: "right", fontSize: 16 }}>
                <Text strong>Tổng món ăn/uống:</Text>{" "}
                <Text strong type="success">{foodDrinkTotal.toLocaleString()} ₫</Text>
            </div>

            {endTime && tableCharge > 0 && (
                <div style={{ textAlign: "right", fontSize: 16 }}>
                    <Text strong>Tiền sử dụng bàn:</Text>{" "}
                    <Text strong type="warning">{tableCharge.toLocaleString()} ₫</Text>
                    <br />
                    {slotDetails.map((slot) => (
                        <Text type="secondary" key={slot.timeSlot}>
                            ▪ {slot.hours} giờ trong khung {slot.timeSlot}
                            <br />
                        </Text>
                    ))}
                </div>
            )}

            <Divider />

            <div style={{ textAlign: "right", fontSize: 18 }}>
                <Text strong>Tổng cộng:</Text>{" "}
                <Text strong type="danger">{grandTotal.toLocaleString()} ₫</Text>
            </div>
        </div>
    );
};

export default OrderSummary;
