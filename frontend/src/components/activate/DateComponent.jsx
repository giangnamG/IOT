import { useEffect, useState, useCallback } from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setDate } from "../../redux/DateRedux";
import config from "../../config";

export default function DateComponent() {
    const dispatch = useDispatch();

    const currentDate = () => {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return formattedDate;
    }

    const [fromDay, setFromDay] = useState(currentDate());
    const [toDay, setToDay] = useState(currentDate());

    const handleFromDayChange = useCallback((value) => {
        setFromDay(value);
        if (value > toDay) {
            setToDay(value); // Đồng bộ toDay nếu fromDay lớn hơn
        }
    }, [toDay]);

    const handleToDayChange = useCallback((value) => {
        setToDay(value);
    }, []);

    useEffect(() => {
        dispatch(setDate({
            fromDay: fromDay,
            toDay: toDay,
        }));
    }, [fromDay, toDay, dispatch]);

    return (
        <>
            {/* date time FROM */}
            <Col lg={2} style={{ paddingInline: 2, paddingTop: 2.5, height: 44 }}>
                <InputGroup>
                    <InputGroup.Text style={{
                        backgroundColor: config.app.styles.backgroundColor,
                        borderColor: config.app.styles.backgroundColor2,
                        cursor: 'pointer',
                        borderRadius: '5px',
                        padding: 8,
                        color: config.app.styles.fontLink,
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}>Từ Ngày</InputGroup.Text>
                    <Form.Control
                        type="date"
                        value={fromDay}
                        className="none-outline"
                        style={{
                            display: 'inline-block',
                            backgroundColor: config.app.styles.backgroundColor2,
                            color: config.app.styles.fontLink,
                            cursor: 'pointer',
                            borderColor: config.app.styles.backgroundColor2,
                            borderRadius: '5px',
                            padding: 8,
                        }}
                        onChange={(e) => handleFromDayChange(e.target.value)}
                    />
                </InputGroup>
            </Col>
            {/* date time TO */}
            <Col lg={2} style={{ paddingInline: 2, paddingTop: 2.5, height: 44 }}>
                <InputGroup>
                    <InputGroup.Text style={{
                        backgroundColor: config.app.styles.backgroundColor,
                        borderColor: config.app.styles.backgroundColor2,
                        cursor: 'pointer',
                        borderRadius: '5px',
                        padding: '8px',
                        color: config.app.styles.fontLink,
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}>Đến Ngày</InputGroup.Text>
                    <Form.Control
                        type="date"
                        value={toDay}
                        className="none-outline"
                        style={{
                            display: 'inline-block',
                            backgroundColor: config.app.styles.backgroundColor2,
                            color: config.app.styles.fontLink,
                            cursor: 'pointer',
                            borderColor: config.app.styles.backgroundColor2,
                            borderRadius: '5px',
                            padding: '8px',
                        }}
                        onChange={(e) => handleToDayChange(e.target.value)}
                    />
                </InputGroup>
            </Col>
        </>
    );
}
