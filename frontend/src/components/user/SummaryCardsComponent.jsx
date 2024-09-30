import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import config from '../../config';
import { useSelector } from 'react-redux';

const styleSummaryCards = {
    summaryCard: {
        backgroundColor: config.app.styles.summaryColor, // Màu nền được lấy từ config
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        textAlign: 'center',
    },
    cardValue: {
        fontSize: '2em',
        fontWeight: 'bold',
    },
    cardLabel: {
        fontSize: '1em',
        color: 'gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
    }
};

export default function SummaryCardsComponent() {
    const { dataStream } = useSelector((state) => state.streaming);

    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [light, setLight] = useState(0);
    const [wind, setWind] = useState(54); // Mức gió giả định, có thể cập nhật từ dataStream nếu có

    useEffect(() => {
        if (!dataStream || !dataStream.message) return;

        if (dataStream) {
            setTemp(dataStream.message.temp);
            setHumidity(dataStream.message.humidity);
            setLight(dataStream.message.light);
        } else {
            setTemp(0);
            setHumidity(0);
            setLight(0);
        }
    }, [dataStream]);

    const cards = [
        { label: "Nhiệt Độ", value: temp, icon: "bi-thermometer-half", iconColor: config.app.styles.iconColors.nhietDo },
        { label: "Độ Ẩm", value: humidity, icon: "bi-droplet-half", iconColor: config.app.styles.iconColors.doAm },
        { label: "Ánh Sáng", value: light, icon: "bi-brightness-high-fill", iconColor: config.app.styles.iconColors.anhSang },
        { label: "Mức Gió", value: wind, icon: "bi-tornado", iconColor: config.app.styles.iconColors.gio }, // Cập nhật Mức Gió nếu có từ dataStream
    ];

    return (
        <Row style={{
            justifyContent: 'center',
            padding: 10,
            marginBottom: 20,
            gap: 20,
        }}>
            {cards.map((card, index) => (
                <Col key={index} lg={4} md={6} sm={12}>
                    <div className="summary-card" style={{ ...styleSummaryCards.summaryCard, cursor: 'pointer' }}>
                        {card.label === "Nhiệt Độ" ? (
                            <CircularProgressbar
                                value={(temp / 50) * 100} // Giả sử nhiệt độ tối đa là 50°C
                                text={`${temp}°C`}
                                styles={buildStyles({
                                    pathColor: 'rgba(255, 99, 132, 1)', // Màu cho nhiệt độ
                                    textColor: '#fff',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        ) : card.label === "Độ Ẩm" ? (
                            <CircularProgressbar
                                value={(humidity / 100) * 100} // Giả sử độ ẩm tối đa là 100%
                                text={`${humidity}%`}
                                styles={buildStyles({
                                    pathColor: 'rgba(54, 162, 235, 1)', // Màu cho độ ẩm, tông xanh nước
                                    textColor: '#fff',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        ) : card.label === "Ánh Sáng" ? (
                            <CircularProgressbar
                                value={(light / 1000) * 100} // Giả sử cường độ ánh sáng tối đa là 1000 lux
                                text={`${light} lux`}
                                styles={buildStyles({
                                    pathColor: 'rgba(255, 206, 86, 1)', // Màu cho ánh sáng, tông vàng
                                    textColor: '#fff',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        ) : card.label === "Mức Gió" ? (
                            <CircularProgressbar
                                value={(wind / 100) * 100} // Giả sử mức gió tối đa là 100 (đơn vị giả định)
                                text={`${wind}`}
                                styles={buildStyles({
                                    pathColor: 'rgba(75, 192, 192, 1)', // Màu cho mức gió, tông xanh ngọc
                                    textColor: '#fff',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                        ) : (
                            <div className="card-value" style={styleSummaryCards.cardValue}>{card.value}</div>
                        )}
                        <div className="card-label" style={styleSummaryCards.cardLabel}>
                            <i className={`bi ${card.icon}`} style={{ color: card.iconColor, marginRight: '8px', }}></i>
                            {card.label}
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );
}
