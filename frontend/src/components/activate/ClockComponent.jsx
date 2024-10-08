import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import config from '../../config';

const ClockComponent = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <Col lg={2} style={{
            backgroundColor: config.app.styles.backgroundColor2,
            borderColor: config.app.styles.backgroundColor2,
            borderRadius: '5px',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            textAlign: 'center',
            height: 44

        }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatTime(time)}
            </div>
        </Col>
    );
};

export default ClockComponent;
