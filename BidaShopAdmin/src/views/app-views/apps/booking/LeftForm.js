import React from "react";
import {
    Input,
    DatePicker,
    Row,
    Col,
    Divider,
    Card,
    Button,
    Typography,
    Form,
    Tag,
    notification,
} from "antd";
import moment from "moment";

const { Text } = Typography;

const LeftForm = ({
    customers,
    customerPhone,
    setCustomerPhone,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    menu,
    orderedItems,
    setOrderedItems,
}) => {
    const handleAddDrink = (drink) => {
        const exists = orderedItems.find((item) => item.id === drink.id);
        const currentQty = exists ? exists.quantity : 0;

        // Nếu đã đạt giới hạn số lượng còn lại
        if (currentQty >= drink.quantity) {
            notification.warning({
                message: "Không đủ số lượng",
                description: `"${drink.name}" chỉ còn lại ${drink.quantity} sản phẩm.`,
            });
            return;
        }

        if (exists) {
            setOrderedItems((prev) =>
                prev.map((item) =>
                    item.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setOrderedItems((prev) => [...prev, { ...drink, quantity: 1 }]);
        }
    };

    return (
        <>
            <Text style={{ marginBottom: 10 }} strong>Nhập số điện thoại khách hàng</Text>
            <Form.Item
                validateStatus={
                    customerPhone && !/^0\d{9}$/.test(customerPhone) ? "error" : ""
                }
                help={
                    customerPhone && !/^0\d{9}$/.test(customerPhone)
                        ? "Số điện thoại không hợp lệ (bắt đầu bằng 0 và đủ 10 số)"
                        : ""
                }
            >
                <Input
                    placeholder="Nhập số điện thoại"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ width: "100%" }}
                />
            </Form.Item>
            <Row gutter={12} style={{ marginBottom: 12 }}>
                <Col span={12}>
                    <Text strong>Thời gian bắt đầu</Text>
                    <DatePicker
                        showTime={{ format: "HH:mm" }}
                        format="DD/MM/YYYY HH:mm"
                        style={{ width: "100%", marginTop: 4 }}
                        value={startTime ? moment(startTime) : null}
                        onChange={setStartTime}
                        disabledDate={(current) => current && current > moment().endOf("day")}
                        disabledTime={(current) => {
                            if (!current || !current.isSame(moment(), "day")) return {};
                            return {
                                disabledHours: () => {
                                    const hours = [];
                                    const nowHour = moment().hour();
                                    for (let i = nowHour + 1; i <= 23; i++) hours.push(i);
                                    return hours;
                                },
                            };
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Text strong>Thời gian kết thúc</Text>
                    <DatePicker
                        showTime={{ format: "HH:mm" }}
                        format="DD/MM/YYYY HH:mm"
                        style={{ width: "100%", marginTop: 4 }}
                        value={endTime}
                        onChange={setEndTime}
                        disabledDate={(current) => {
                            if (!startTime) return false;
                            return current && current.isBefore(moment(startTime), "minute");
                        }}
                        disabledTime={(current) => {
                            if (!startTime || !current) return {};

                            const minEndTime = moment(startTime);
                            if (!current.isSame(minEndTime, "day")) return {};

                            const minHour = minEndTime.hour();
                            const minMinute = minEndTime.minute();

                            return {
                                disabledHours: () => {
                                    const hours = [];
                                    for (let i = 0; i < minHour; i++) hours.push(i);
                                    return hours;
                                },
                                disabledMinutes: (selectedHour) => {
                                    if (selectedHour === minHour) {
                                        const minutes = [];
                                        for (let i = 0; i < minMinute; i++) minutes.push(i);
                                        return minutes;
                                    }
                                    return [];
                                },
                            };
                        }}
                    />
                </Col>
            </Row>

            <Divider orientation="left" style={{ marginTop: 24 }}>
                Danh sách món
            </Divider>
            <Row gutter={[12, 12]}>
                {menu.map((item) => {
                    const isLow = item.quantity <= item.warningThreshold;

                    return (
                        <Col span={8} key={item.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={item.name}
                                        src={item.image}
                                        style={{ height: 100, objectFit: "cover" }}
                                    />
                                }
                            >
                                <Card.Meta
                                    title={
                                        <div>
                                            {item.name}
                                            {isLow && (
                                                <Tag color="red" style={{ marginLeft: 8 }}>
                                                    Sắp hết
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div style={{ marginTop: 8 }}>
                                            <div>{item.price?.toLocaleString()} ₫</div>
                                            <div style={{ marginTop: 4 }}>
                                                <Tag color={isLow ? "red" : "green"}>
                                                    Còn lại: {item.quantity}
                                                </Tag>
                                            </div>
                                            <Button
                                                type="primary"
                                                size="small"
                                                block
                                                style={{ marginTop: 4 }}
                                                onClick={() => handleAddDrink(item)}
                                            >
                                                Thêm
                                            </Button>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>

        </>
    );
};

export default LeftForm;
