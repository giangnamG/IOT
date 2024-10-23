import React, { useState, useEffect } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';

// Hàm để lưu dữ liệu vào localStorage
const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Hàm để lấy dữ liệu từ localStorage
const getFromLocalStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
};

export default function MiniSensorWarningLog() {
    // Lấy dataStream từ Redux
    const { dataStream } = useSelector((state) => state.streaming);

    // Khởi tạo state để lưu giá trị của các cảm biến
    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [light, setLight] = useState(0);
    const [wind, setWind] = useState(54); // Mức gió giả định, có thể cập nhật từ dataStream nếu có
    const [dust, setDust] = useState(14);
    const [rain, setRain] = useState(14);

    // Khởi tạo state để lưu số lần vượt ngưỡng cho từng cảm biến
    const [exceedCounts, setExceedCounts] = useState(() =>
        getFromLocalStorage('exceedCounts', {
            temp: 0,
            humidity: 0,
            light: 0,
            dust: 0,
            wind: 0,
            rain: 0,
        })
    );

    // Cập nhật các giá trị cảm biến từ dataStream
    useEffect(() => {
        if (dataStream && dataStream.message) {
            setTemp(dataStream.message.temp || 0);
            setHumidity(dataStream.message.humidity || 0);
            setLight(dataStream.message.light || 0);
            setWind(12); // Cập nhật mức gió (giả định)
            setDust(14); // Cập nhật mức độ bụi (giả định)
            setRain(14); // Cập nhật mức mưa (giả định)
        } else {
            setTemp(0);
            setHumidity(0);
            setLight(0);
        }
    }, [dataStream]);

    // Mảng chứa thông tin các cảm biến và ngưỡng của chúng
    const sensors = [
        { label: 'Nhiệt Độ', value: temp, threshold: 40 },
        { label: 'Độ Ẩm', value: humidity, threshold: 80 },
        { label: 'Ánh Sáng', value: light, threshold: 100 },
        { label: 'Độ Bụi', value: dust, threshold: 100 },
        { label: 'Độ Gió', value: wind, threshold: 15 },
        { label: 'Mức Mưa', value: rain, threshold: 20 },
    ];

    // Cập nhật số lần vượt ngưỡng khi giá trị cảm biến thay đổi
    useEffect(() => {
        const newCounts = { ...exceedCounts };

        sensors.forEach((sensor) => {
            if (sensor.value > sensor.threshold) {
                newCounts[sensor.label.toLowerCase()] += 1;
            }
        });

        // Lưu trạng thái mới
        setExceedCounts(newCounts);
        saveToLocalStorage('exceedCounts', newCounts); // Lưu vào localStorage
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp, humidity, light, dust, wind, rain, exceedCounts]);

    // Style cho log
    const logStyle = {
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: config.app.styles.backgroundColor2,
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const logHeaderStyle = {
        textAlign: 'center',
        fontSize: '1.5em',
        marginBottom: '15px',
        fontWeight: 'bold',
    };

    const logItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    };

    const alertIconStyle = {
        fontSize: '16px',
        color: '#FF0000', // Màu đỏ cho đèn cảnh báo
        marginLeft: '10px',
    };

    return (
        <div style={logStyle}>
            <h3 style={logHeaderStyle}>Mini Log - Số Lần Cảm Biến Vượt Ngưỡng</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {sensors.map((sensor, index) => (
                    <li key={index} style={logItemStyle}>
                        <span>{sensor.label}</span>
                        <span>
                            {sensor.value} {sensor.value > sensor.threshold && (
                                <i className="bi bi-exclamation-circle-fill" style={alertIconStyle}></i>
                            )}
                        </span>
                        <span>{exceedCounts[sensor.label.toLowerCase()]} lần</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
