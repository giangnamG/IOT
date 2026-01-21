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
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex', // Dùng flex để căn bố cục
    maxWidth: '800px',
};

const tableContainerStyle = {
    flex: 1, // Để bảng chiếm phần còn lại của hộp
};

const titleStyle = {
    writingMode: 'vertical-rl', // Tiêu đề theo chiều dọc
    transform: 'rotate(180deg)', // Đảo ngược chữ
    textAlign: 'center',
    marginRight: '20px', // Tạo khoảng cách giữa tiêu đề và bảng
};

const scrollableTableStyle = {
    maxHeight: '250px', // Đặt chiều cao tối đa cho vùng bảng cuộn
    overflowY: 'auto',
};

const iconStyle = {
    fontSize: '24px',
    marginRight: '10px',
    color: '#FFD700', // Màu vàng cho biểu tượng
};

const lightbulbIconStyle = {
    fontSize: '24px',
    color: '#FFEB3B', // Màu vàng cho biểu tượng bóng đèn
    marginLeft: '10px',
};

const cellStyle = {
    textAlign: 'center', // Căn giữa theo chiều ngang
    verticalAlign: 'middle', // Căn giữa theo chiều dọc
};

export default function WarningSensorComponent() {
    const { stateWaring } = useSelector((state) => state.waringCountRedux);

    const [sensors, setSensors] = useState([
        { name: 'dust', label: 'Độ Bụi', threshold: 70, unit: 'μg/m³', icon: 'bi-cloud-haze', count: 0, isWaring: false },
    ]);

    // State để điều khiển việc nhấp nháy của biểu tượng
    const [blink, setBlink] = useState(false);

    // Sử dụng useEffect để tạo hiệu ứng nhấp nháy
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(prevBlink => !prevBlink); // Cập nhật trạng thái nhấp nháy
        }, 500); // Chuyển đổi trạng thái mỗi 500ms (0.5 giây)
        return () => clearInterval(interval); // Xóa interval khi component bị unmount
    }, []);

    useEffect(() => {
        if (stateWaring) {
            const updatedSensors = sensors.map(sensor => {
                const sensorWarning = stateWaring[sensor.name];
                if (sensorWarning) {
                    return {
                        ...sensor,
                        count: sensorWarning.count,
                        isWaring: sensorWarning.status === 'warning',
                        threshold: sensorWarning.threshold,
                    };
                }
                return sensor;
            });
            setSensors(updatedSensors);
            console.log(sensors[0].isWaring)
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
                                <th>Sensor</th>
                                <th>Threshold</th>
                                <th>War</th>
                                <th>Count</th>
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
                                        {sensor.isWaring}{sensor.isWaring && (
                                            <i className="bi bi-lightbulb-fill" style={{
                                                ...lightbulbIconStyle,
                                                opacity: blink ? 1 : 0.2, // Nhấp nháy bóng đèn
                                            }}></i>
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
