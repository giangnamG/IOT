import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
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

    const [temp, setTemp] = useState(0)
    const [humidity, setHumidity] = useState(0)
    const [light, setLight] = useState(0)

    useEffect(() => {
        if (!dataStream || !dataStream.message) return;
        const intervalId = setInterval(() => {
            if (dataStream) {
                setTemp(dataStream.message.temp);
                setHumidity(dataStream.message.humidity);
                setLight(dataStream.message.light);
            } else {
                setTemp(0);
                setHumidity(0);
                setLight(0);
            }
        }, 2000)
        return () => clearInterval(intervalId);

    }, [dataStream])

    const cards = [
        { label: "Nhiệt Độ", value: temp, icon: "bi-thermometer-half", iconColor: config.app.styles.iconColors.nhietDo }, // Icon nhiệt độ
        { label: "Độ Ẩm", value: humidity, icon: "bi-droplet-half", iconColor: config.app.styles.iconColors.doAm },           // Icon độ ẩm
        { label: "Ánh Sáng", value: light, icon: "bi-brightness-high-fill", iconColor: config.app.styles.iconColors.anhSang }, // Icon ánh sáng
        { label: "Mức Gió", value: 54, icon: "bi-tornado", iconColor: config.app.styles.iconColors.anhSang }, // Icon ánh sáng
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
                        <div className="card-value" style={styleSummaryCards.cardValue}>{card.value}</div>
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
