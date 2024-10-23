import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import config from '../../config'
import { useSelector } from 'react-redux'

const styleSummaryCards = {
    summaryCard: {
        backgroundColor: config.app.styles.summaryColor, // Màu nền được lấy từ config
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        paddingBottom: 20,
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
}

export default function SummaryCardsComponent() {
    const { dataStream } = useSelector((state) => state.streaming)

    const [temp, setTemp] = useState(0)
    const [humidity, setHumidity] = useState(0)
    const [light, setLight] = useState(0)
    const [wind, setWind] = useState(0) // Mức gió giả định, có thể cập nhật từ dataStream nếu có
    const [dust, setDust] = useState(0)
    const [rain, setRain] = useState(0)

    useEffect(() => {
        if (!dataStream || !dataStream.message) return
        if (dataStream) {
            setTemp(dataStream.message.temp)
            setHumidity(dataStream.message.humidity)
            setLight(dataStream.message.light)
            setDust(dataStream.message.dust)
            setWind(dataStream.message.windSpeed)
            setRain(dataStream.message.rain)
        } else {
            setTemp(0)
            setHumidity(0)
            setLight(0)
            setDust(0)
            setRain(0)
            setWind(0)
        }
    }, [dataStream])

    const cards = [
        { label: "Nhiệt Độ", value: temp, icon: "bi-thermometer-half", iconColor: config.app.styles.iconColors.nhietDo },
        { label: "Độ Ẩm", value: humidity, icon: "bi-droplet-half", iconColor: config.app.styles.iconColors.doAm },
        { label: "Ánh Sáng", value: light, icon: "bi-brightness-high-fill", iconColor: config.app.styles.iconColors.anhSang },
        { label: "Mức Gió", value: wind, icon: "bi-wind", iconColor: config.app.styles.iconColors.gio }, // Cập nhật Mức Gió nếu có từ dataStream
        { label: "Độ Bụi", value: dust, icon: "bi-cloud-haze", iconColor: config.app.styles.iconColors.gio }, // Cập nhật Mức Gió nếu có từ dataStream
        { label: "Mức Mưa", value: rain, icon: "bi-tornado", iconColor: config.app.styles.iconColors.gio }, // Cập nhật Mức Gió nếu có từ dataStream
    ]

    // Hàm tạo CircularProgressbar cho các thẻ
    const renderCircularProgressBar = (value, maxValue, text, pathColor) => (
        <CircularProgressbar
            value={(value / maxValue) * 100}
            text={text}
            styles={buildStyles({
                pathColor: pathColor,
                textColor: '#fff',
                trailColor: '#d6d6d6',
                backgroundColor: '#3e98c7',
                marginBottom: 20,
            })}
        />
    )

    return (
        <Row style={{
            padding: 10,
            marginBottom: 10,
            backgroundColor: config.app.styles.backgroundColor, // Đặt màu nền để không bị trong suốt
        }}>
            {cards.map((card, index) => (
                <Col key={index} lg={4} md={4} sm={12} style={{
                    paddingBottom: 20,
                }}>
                    <div className="summary-card" style={{ ...styleSummaryCards.summaryCard, cursor: 'pointer' }}>

                        {card.label === "Nhiệt Độ" ? (
                            renderCircularProgressBar(temp, 50, `${temp}°C`, config.app.styles.iconColors.nhietDo)
                        ) : card.label === "Độ Ẩm" ? (
                            renderCircularProgressBar(humidity, 100, `${humidity}%`, config.app.styles.iconColors.doAm)
                        ) : card.label === "Ánh Sáng" ? (
                            renderCircularProgressBar(light, 1000, `${light} lux`, config.app.styles.iconColors.anhSang)
                        ) : card.label === "Mức Gió" ? (
                            renderCircularProgressBar(wind, 100, `${wind} m/s`, config.app.styles.iconColors.gio)
                        ) : card.label === "Độ Bụi" ? (
                            renderCircularProgressBar(dust, 100, `${dust} μg/m³`, config.app.styles.iconColors.bui)
                        ) : card.label === "Mức Mưa" ? (
                            renderCircularProgressBar(rain, 100, `${rain} mm`, config.app.styles.iconColors.mua)
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
    )
}
