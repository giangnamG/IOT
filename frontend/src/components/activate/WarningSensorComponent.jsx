import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo bạn đã cài đặt và sử dụng Bootstrap
import config from '../../config';
import { useSelector } from 'react-redux';

const warningBoxStyle = {
    backgroundColor: config.app.styles.backgroundColor2, // Màu nền tối
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    display: 'flex', // Dùng flex để căn bố cục
    alignItems: 'flex-start', // Căn chỉnh theo chiều dọc
    maxWidth: '800px', // Giới hạn chiều rộng của hộp tổng thể
};

const titleStyle = {
    writingMode: 'vertical-rl', // Tiêu đề theo chiều dọc
    transform: 'rotate(180deg)', // Đảo ngược chữ
    textAlign: 'center', // Căn giữa chữ theo chiều dọc
    marginRight: '20px', // Tạo khoảng cách giữa tiêu đề và bảng
};

const tableContainerStyle = {
    flex: 1, // Để bảng chiếm phần còn lại của hộp
};

const scrollableTableStyle = {
    maxHeight: '250px', // Đặt chiều cao tối đa cho vùng bảng cuộn
    overflowY: 'auto', // Bật tính năng cuộn dọc khi nội dung vượt quá chiều cao
};

const iconStyle = {
    fontSize: '24px',
    marginRight: '10px',
    color: '#FFD700', // Màu vàng cho biểu tượng
};

const alertIconStyle = {
    fontSize: '16px',
    color: '#FF0000', // Màu đỏ cho đèn cảnh báo
    marginLeft: '10px',
};

const cellStyle = {
    textAlign: 'center', // Căn giữa theo chiều ngang
    verticalAlign: 'middle', // Căn giữa theo chiều dọc
};

export default function WarningSensorComponent() {
    const { stateWaring } = useSelector((state) => state.waringCountRedux);

    const [sensors, setSensors] = useState([
        { name: 'temp', label: 'Nhiệt Độ', threshold: 40, unit: '°C', icon: 'bi-thermometer-half', count: 0, isWaring: false },
        { name: 'humidity', label: 'Độ Ẩm', threshold: 80, unit: '%', icon: 'bi-droplet-half', count: 0, isWaring: false },
        { name: 'light', label: 'Ánh Sáng', threshold: 200, unit: 'lux', icon: 'bi-brightness-high', count: 0, isWaring: false },
        { name: 'dust', label: 'Độ Bụi', threshold: 10, unit: 'μg/m³', icon: 'bi-cloud-haze', count: 0, isWaring: false },
        { name: 'windSpeed', label: 'Độ Gió', threshold: 10, unit: 'm/s', icon: 'bi-wind', count: 0, isWaring: false },
        { name: 'rain', label: 'Mức Mưa', threshold: 150, unit: 'mm', icon: 'bi-cloud-rain', count: 0, isWaring: false },
    ]);

    useEffect(() => {
        if (stateWaring) {
            const updatedSensors = sensors.map(sensor => {
                const sensorWarning = stateWaring[sensor.name];
                if (sensorWarning) {
                    return {
                        ...sensor,
                        count: sensorWarning.count,
                        isWaring: sensorWarning.status === 'waring',
                        threshold: sensorWarning.threshold,
                    };
                }
                return sensor;
            });
            setSensors(updatedSensors);
        }
    }, [stateWaring]);

    return (
        <div style={warningBoxStyle}>
            <h4 style={titleStyle}>
                Cảnh Báo Thời Tiết
            </h4>

            <div style={tableContainerStyle}>
                <div style={scrollableTableStyle}>
                    <Table bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Tên Cảm Biến</th>
                                <th>Ngưỡng</th>
                                <th>Cảnh Báo</th>
                                <th>Đạt Cảnh Báo (Lần)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sensors.map((sensor, index) => (
                                <tr key={index}>
                                    <td>
                                        <i className={`bi ${sensor.icon}`} style={iconStyle}></i>
                                        {sensor.label}
                                    </td>
                                    <td style={cellStyle}>{sensor.threshold}</td>
                                    <td style={cellStyle}>
                                        {sensor.isWaring && (
                                            <i className="bi bi-exclamation-circle-fill" style={alertIconStyle}></i>
                                        )}
                                    </td>
                                    <td style={cellStyle}>{sensor.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
