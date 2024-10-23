import { Form, Col, InputGroup, Button } from "react-bootstrap";  // Thêm Form từ react-bootstrap
import { useState } from "react";
import config from "../../config";
import axios from "axios";

const currentDate = () => {
    const today = new Date();
    const day = today.getDate(); // Lấy ngày
    const month = today.getMonth() + 1; // Lấy tháng (0-11), cần +1 để đúng tháng thực tế
    const year = today.getFullYear(); // Lấy năm

    // Định dạng ngày tháng năm theo kiểu yyyy-mm-dd
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate;
}

export default function SearchFilterDate() {
    const [fromDay, setFromDay] = useState(currentDate());
    const [toDay, setToDay] = useState(currentDate());
    const [searchText, setSearchText] = useState('');

    const handleFromDayChange = (value) => {
        setFromDay(value);
    };

    const handleToDayChange = (value) => {
        setToDay(value);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        axios.post(config.backend.baseUrl + '/device/logs/filter', {
            "from": fromDay,
            "to": toDay,
            "search": searchText
        }).then((res) => {
            console.log('res: ', res.data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {

        })
    }

    return (
        <>
            {/* date time FROM */}
            <Col lg={2} style={{
                paddingInline: 2,
                paddingTop: 2.5,
                height: 44
            }}>
                <InputGroup>
                    <InputGroup.Text style={{
                        backgroundColor: config.app.styles.backgroundColor,
                        borderColor: config.app.styles.backgroundColor2,
                        cursor: 'pointer',
                        borderRadius: '5px',
                        padding: 8,
                        color: config.app.styles.fontLink,
                        fontSize: 14,
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
            <Col lg={2} style={{
                paddingInline: 2,
                paddingTop: 2.5,
                height: 44
            }}>
                <InputGroup>
                    <InputGroup.Text style={{
                        backgroundColor: config.app.styles.backgroundColor,
                        borderColor: config.app.styles.backgroundColor2,
                        cursor: 'pointer',
                        borderRadius: '5px',
                        padding: '8px',
                        color: config.app.styles.fontLink,
                        fontSize: 14,
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
            {/* Search */}
            <Col lg={3} style={{
                display: 'inline-block',
                justifyContent: 'center',
                paddingLeft: '8px',
                height: 44
            }}>
                <InputGroup className="mb-3"
                    style={{
                        borderColor: config.app.styles.backgroundColor,
                        cursor: 'pointer',
                        paddingTop: 4,
                        height: '100%'
                    }}>
                    <InputGroup.Text id="basic-addon1" style={{
                        backgroundColor: config.app.styles.backgroundColor2,
                        color: config.app.styles.fontLink,
                        borderColor: config.app.styles.backgroundColor2,
                        fontWeight: 'bold',
                    }}>@Search</InputGroup.Text>
                    <Form.Control
                        placeholder="format: 23:10:00 ..."
                        aria-label="Time"
                        aria-describedby="basic-addon1"
                        value={searchText}
                        className="none-outline"
                        style={{
                            backgroundColor: config.app.styles.backgroundColor2,
                            borderColor: config.app.styles.backgroundColor2,
                            color: config.app.styles.fontLink,

                        }}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e); // Gọi hàm xử lý submit khi nhấn Enter
                            }
                        }}
                    />
                </InputGroup>
            </Col>
        </>
    );
}
