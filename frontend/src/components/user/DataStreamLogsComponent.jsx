import { Container, Table, Form, Row, Col, InputGroup, Button } from "react-bootstrap";  // Thêm Form từ react-bootstrap
import config from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import DataPagination from "../activate/DataPagination";
import ClockComponent from "../activate/ClockComponent"
import SpinnerComponent from "../activate/SpinnerComponent"
import "../../assets/css/fadeIn.css"


export default function DataStreamLogsComponent({ props }) {

    const styles = {
        table: {
            borderRadius: '5px',
            textAlign: 'center', backgroundColor: config.app.styles.backgroundColor,
            color: config.app.styles.fontLink,
        }
    }
    const [isRealTime, setIsRealTime] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(50)

    const [fromDay, setFromDay] = useState("")
    const [toDay, setToDay] = useState("")


    useEffect(() => {
        const fetchData = () => {
            axios.post(config.backend.baseUrl + '/data_stream_logs', {
                "page": currentPage,
                "per_page": perPage,
                "latest": true
            })
                .then(response => {
                    setData(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        fetchData(); // Gọi hàm fetchData ngay khi component mount hoặc khi dependencies thay đổi

        if (isRealTime) {
            const interval = setInterval(fetchData, 3000); // Lặp lại sau mỗi 3 giây

            return () => clearInterval(interval);
        }
    }, [currentPage, perPage, isRealTime]);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setIsLoading(true);
        console.log(pageNumber)
        // Fetch data mới dựa trên trang hiện tại
    };
    const handlePerPageChange = (perPageNumber) => {
        setPerPage(parseInt(perPageNumber));
        setCurrentPage(1);
        setIsLoading(true);
        console.log(perPageNumber)
        // Fetch data mới dựa trên trang hiện tại
    }
    const handleRealTimeToggle = () => {
        setIsRealTime(!isRealTime);
        setIsLoading(true);
    }
    const handleFromDayChange = (value) => {
        const arr = value.split('-')
        const newFormat = `${arr[2]}-${arr[1]}-${arr[0]}`
        setFromDay(newFormat);
        console.log('from: ', newFormat)
    }
    const handleToDayChange = (value) => {
        const arr = value.split('-')
        const newFormat = `${arr[2]}-${arr[1]}-${arr[0]}`
        setToDay(newFormat);
        console.log('to: ', newFormat)
    }
    return (
        <Container >

            <Container style={{
                position: 'fixed',
                top: 40,
                left: 200,
                width: '83%',
                height: 'auto',
                padding: '20px',
                borderRadius: '5px',
                color: config.app.styles.fontLink,
                zIndex: 1000,
                marginLeft: 60,
                backgroundColor: config.app.styles.backgroundColor
            }}>
                <h1 style={{
                    marginBottom: 16,
                }}>History</h1>
                <Row style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: config.app.styles.fontLink,
                    gap: '16px', // Sử dụng gap để tạo khoảng cách giữa các cột
                }}>
                    {/* per/page */}
                    <Col lg={1} style={{
                        backgroundColor: config.app.styles.backgroundColor2,
                        borderColor: config.app.styles.backgroundColor2,
                        borderRadius: '5px',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: "center",
                        height: 44
                    }}>
                        <Form.Select aria-label="Default select example"
                            style={{
                                display: 'inline-block',
                                cursor: 'pointer',
                                backgroundColor: config.app.styles.backgroundColor2,
                                color: config.app.styles.fontLink,
                                borderColor: config.app.styles.backgroundColor2,
                                borderRadius: '5px',
                                textAlign: 'center',
                                padding: 1,
                                fontWeight: 'bold',
                            }}
                            onChange={(e) => handlePerPageChange(e.target.value)}
                        >
                            <option value="50">Row: 50</option>
                            <option value="50">50</option>
                            <option value="60">60</option>
                            <option value="70">70</option>
                            <option value="80">80</option>
                            <option value="90">90</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                            <option value="500">500</option>
                        </Form.Select>
                    </Col>
                    {/* Clock */}
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
                        <ClockComponent />
                    </Col>
                    {/* date time FROM */}
                    <Col lg={2} style={{
                        paddingInline: 2,
                        paddingTop: 2.5,
                        height: 44
                    }}>
                        <InputGroup>
                            <InputGroup.Text style={{
                                backgroundColor: config.app.styles.backgroundColor,  // Điều chỉnh màu nền cho phù hợp với giao diện
                                borderColor: config.app.styles.backgroundColor2,
                                cursor: 'pointer',
                                borderRadius: '5px',
                                padding: 8,
                                color: config.app.styles.fontLink,
                                fontSize: 12,             // Điều chỉnh màu chữ cho phù hợp với giao diện
                                fontWeight: 'bold',
                            }}>Từ Ngày</InputGroup.Text>
                            <Form.Control
                                type="date"
                                placeholder="Select Date"
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
                                backgroundColor: config.app.styles.backgroundColor,  // Điều chỉnh màu nền cho phù hợp với giao diện
                                borderColor: config.app.styles.backgroundColor2,
                                cursor: 'pointer',
                                borderRadius: '5px',
                                padding: '8px',
                                color: config.app.styles.fontLink,               // Điều chỉnh màu chữ cho phù hợp với giao diện
                                fontSize: 12,           // Điều chỉnh màu chữ cho phù hợp với giao diện
                                fontWeight: 'bold',
                            }}>Đến Ngày</InputGroup.Text>
                            <Form.Control
                                type="date"
                                placeholder="Select Date"
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
                                placeholder="Search For Time ..."
                                aria-label="Time"
                                aria-describedby="basic-addon1"
                                style={{
                                    backgroundColor: config.app.styles.backgroundColor2,
                                    borderColor: config.app.styles.backgroundColor2,
                                    color: config.app.styles.fontLink,
                                    cursor: 'pointer',

                                }}
                            />
                        </InputGroup>
                    </Col>
                </Row>

            </Container>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: 140,
                marginBottom: 20,
            }}>
                <Table striped bordered hover style={{ width: '90%' }}>
                    <thead className="fade-in fade-in-2">
                        <tr>
                            <th style={{ ...styles.table, fontSize: '18px', }}>#</th>
                            <th style={{ ...styles.table, fontSize: '18px', }}>Nhiệt Độ</th>
                            <th style={{ ...styles.table, fontSize: '18px', }}>Độ Ẩm</th>
                            <th style={{ ...styles.table, fontSize: '18px', }}>Ánh Sáng</th>
                            <th style={{ ...styles.table, fontSize: '18px', }}>Thời Gian</th>
                        </tr>
                    </thead>
                    <tbody className="fade-in fade-in-6">
                        {
                            Array.isArray(data.data) && data.data.length > 0 && data.data.map((item, index) => (
                                <tr key={index} style={{
                                    cursor: 'pointer',
                                }}>
                                    <td style={{ ...styles.table }}>{index + 1}</td>
                                    <td style={{ ...styles.table }}>{item.temp}</td>
                                    <td style={{ ...styles.table }}>{item.humidity}</td>
                                    <td style={{ ...styles.table }}>{item.light}</td>
                                    <td style={{ ...styles.table }}>{item.timestamp.replace('.000000', '')}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </Table>
            </div>
            <Container style={{
                position: 'fixed',
                bottom: 0, // Cố định container ở cuối trang
                zIndex: 1000, // Đảm bảo container nổi lên trên các thành phần khác nếu cần
                backgroundColor: config.app.styles.backgroundColor, // Màu nền của container
                paddingTop: 12,
                width: '77%',
                height: 60
            }}>
                <Row style={{
                    justifyContent: 'center',
                    alignItems: 'center', // Đảm bảo căn giữa theo chiều dọc
                    display: 'flex', // Đảm bảo sử dụng Flexbox
                    height: 60,
                }} className="fade-in fade-in-8">
                    <Col lg={9}>
                        {/* Pagination */}
                        <DataPagination
                            currentPage={data.page}
                            totalPages={data.pages}
                            onPageChange={handlePageChange}
                            style={{
                                display: 'flex', // Đảm bảo sử dụng Flexbox trong DataPagination
                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng của Row
                                backgroundColor: config.app.styles.backgroundColor
                            }}
                        />
                    </Col>
                    {/* filter */}
                    <Col lg={1} style={{
                        borderColor: config.app.styles.backgroundColor2,
                        borderRadius: '5px',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: "center",
                        alignItems: "center",
                        height: '100%',
                        paddingBottom: 18,
                        cursor: 'pointer',
                    }}>
                        <Form.Select aria-label="Default select example"
                            style={{
                                display: 'inline-block',
                                cursor: 'pointer',
                                backgroundColor: config.app.styles.backgroundColor2,
                                color: config.app.styles.fontLink,
                                borderColor: config.app.styles.backgroundColor2,
                                borderRadius: '5px',
                                textAlign: 'center',
                                padding: 2,
                                height: '100%',
                                fontWeight: 'bold',
                            }}>
                            <option value="default">Sort</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </Col>
                    {/* Button control real time */}
                    <Col lg={2} style={{
                        borderColor: config.app.styles.backgroundColor2,
                        borderRadius: '5px',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: "center",
                        alignItems: "center",
                        height: '100%',
                        paddingBottom: 18,
                        cursor: 'pointer',
                    }}><Button style={{
                        backgroundColor: config.app.styles.backgroundColor2,
                        color: isRealTime ? '#006400' : config.app.styles.fontLink,
                        borderColor: config.app.styles.backgroundColor2,
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 14,
                    }}
                        onClick={handleRealTimeToggle}>
                            {isRealTime ? 'Turn On Real Time' : 'Turn Off Real Time'}
                        </Button></Col>
                </Row>
            </Container>
            {
                isLoading && <SpinnerComponent />
            }
        </Container>
    )
}
