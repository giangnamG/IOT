import { Container, Table, Form, Row, Col, InputGroup, Button } from "react-bootstrap";  // Thêm Form từ react-bootstrap
import config from "../../config";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import DataPagination from "../activate/DataPagination";
import ClockComponent from "../activate/ClockComponent"
import SpinnerComponent from "../activate/SpinnerComponent"
import "../../assets/css/fadeIn.css"
import DateComponent from "../activate/DateComponent";
import { useSelector } from "react-redux"


export default function DataStreamLogsComponent({ props }) {

    const styles = {
        table: {
            borderRadius: '5px',
            textAlign: 'center', backgroundColor: config.app.styles.backgroundColor,
            color: config.app.styles.fontLink,
        }
    }

    const { fromDay, toDay } = useSelector((state) => state.dateRedux)

    const [isRealTime, setIsRealTime] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(50)
    const [isLatest, setIsLatest] = useState(true)

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filterTemp, setFilterTemp] = useState('');
    const [filterHumidity, setFilterHumidity] = useState('');
    const [filterLight, setFilterLight] = useState('');
    const [filterTimestamp, setFilterTimestamp] = useState('');


    useEffect(() => {
        const fetchData = () => {
            axios.post(config.backend.baseUrl + '/sensors/streaming/logs', {
                "page": currentPage,
                "per_page": perPage,
                "latest": isLatest,
                "fromDay": fromDay,
                "toDay": toDay,
                "temp": filterTemp,
                "humidity": filterHumidity,
                "light": filterLight,

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
            const interval = setInterval(fetchData, 2000); // Lặp lại sau mỗi 2 giây

            return () => clearInterval(interval);
        }
    }, [currentPage, perPage, isRealTime, isLatest, fromDay, toDay, filterTemp, filterHumidity, filterLight]);


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


    // Hàm xử lý khi sắp xếp
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const isLatestChange = (value) => {
        setIsLatest(value === "false" ? false : true)
        setIsLoading(true)
    }

    // Kiểm tra nếu data.data tồn tại và là một mảng

    const filteredAndSortedData = useMemo(() => {
        let filteredItems = Array.isArray(data.data) ? [...data.data] : [];
        // Áp dụng bộ lọc cho từng trường
        if (filterTemp) {
            filteredItems = filteredItems.filter(item =>
                item.temp.toString().includes(filterTemp)
            );
        }
        if (filterHumidity) {
            filteredItems = filteredItems.filter(item =>
                item.humidity.toString().includes(filterHumidity)
            );
        }
        if (filterLight) {
            filteredItems = filteredItems.filter(item =>
                item.light.toString().includes(filterLight)
            );
        }
        if (filterTimestamp) {
            filteredItems = filteredItems.filter(item =>
                new Date(item.timestamp).toISOString().replace('T', ' ').substring(0, 19).startsWith(filterTimestamp)
            );
        }

        // Sắp xếp sau khi lọc
        if (sortConfig.key !== null) {
            filteredItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredItems;
    }, [data.data, sortConfig, filterTemp, filterHumidity, filterLight, filterTimestamp]);

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
                marginLeft: 200,
                backgroundColor: config.app.styles.backgroundColor
            }}>
                <h1 style={{
                    marginBottom: 16,
                }}>Data Sensor</h1>
                <Row style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: config.app.styles.fontLink,
                    gap: '16px', // Sử dụng gap để tạo khoảng cách giữa các cột
                }}>
                    {/* pagination */}
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
                            className="none-outline"
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
                            <option value="1000">1000</option>
                        </Form.Select>
                    </Col>

                    {/* Is Latest */}
                    <Col lg={2} style={{
                        backgroundColor: config.app.styles.backgroundColor2,
                        borderColor: config.app.styles.backgroundColor2,
                        borderRadius: '5px',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: "center",
                        height: 44
                    }}>
                        <Form.Select aria-label="Default select example"
                            className="none-outline"
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
                            onChange={(e) => isLatestChange(e.target.value)}
                        >
                            <option value="true"> Is Latest: True</option>
                            <option value="false">Is Latest: False</option>
                        </Form.Select>
                    </Col>

                    {/* Clock */}

                    <ClockComponent />

                    {/* Date Filter */}
                    <DateComponent />

                    {/* Button control real time */}
                    <Col lg={2} style={{
                        borderColor: config.app.styles.backgroundColor2,
                        justifyContent: "center",
                        alignItems: "center",
                        height: '100%',
                        cursor: 'pointer',
                    }}><Button style={{
                        backgroundColor: config.app.styles.backgroundColor2,
                        color: isRealTime ? '#006400' : config.app.styles.fontLink,
                        borderColor: config.app.styles.backgroundColor2,
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginTop: 5,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        className="none-outline"
                        onClick={handleRealTimeToggle}>
                            {isRealTime ? 'Mode Real Time Is On' : 'Mode Real Time Is Off'}
                        </Button></Col>
                </Row>

            </Container>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: 150,
                marginBottom: 20,
            }}>
                <Table striped bordered hover style={{ width: '90%' }}>
                    <thead className="fade-in fade-in-2">
                        <tr>
                            <th style={{ ...styles.table, fontSize: '18px' }}>#</th>
                            <th style={{ ...styles.table, fontSize: '18px' }}>
                                Nhiệt Độ
                                <Button
                                    onClick={() => handleSort('temp')}
                                    style={{ backgroundColor: config.app.styles.backgroundColor, color: 'white', border: 'none' }}
                                >
                                    <i className="bi bi-funnel"></i>
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Filter Temperature"
                                    style={{
                                        backgroundColor: config.app.styles.backgroundColor2,
                                        color: 'red'
                                    }}
                                    onChange={(e) => setFilterTemp(e.target.value)}
                                />
                            </th>
                            <th style={{ ...styles.table, fontSize: '18px' }}>
                                Độ Ẩm
                                <Button
                                    onClick={() => handleSort('humidity')}
                                    style={{ backgroundColor: config.app.styles.backgroundColor, color: 'white', border: 'none' }}
                                >
                                    <i className="bi bi-funnel"></i>
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Filter Humidity"
                                    style={{
                                        backgroundColor: config.app.styles.backgroundColor2,
                                        color: 'red'
                                    }}
                                    onChange={(e) => setFilterHumidity(e.target.value)}
                                />
                            </th>
                            <th style={{ ...styles.table, fontSize: '18px' }}>
                                Ánh Sáng
                                <Button
                                    onClick={() => handleSort('light')}
                                    style={{ backgroundColor: config.app.styles.backgroundColor, color: 'white', border: 'none' }}
                                >
                                    <i className="bi bi-funnel"></i>
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Filter Light"
                                    style={{
                                        backgroundColor: config.app.styles.backgroundColor2,
                                        color: 'red'
                                    }}
                                    onChange={(e) => setFilterLight(e.target.value)}
                                />
                            </th>
                            <th style={{ ...styles.table, fontSize: '18px' }}>
                                Thời Gian
                                <Button
                                    onClick={() => handleSort('timestamp')}
                                    style={{ backgroundColor: config.app.styles.backgroundColor, color: 'white', border: 'none' }}
                                >
                                    <i className="bi bi-funnel"></i>
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Filter Timestamp"
                                    style={{
                                        backgroundColor: config.app.styles.backgroundColor2,
                                        color: 'red'

                                    }}
                                    onChange={(e) => setFilterTimestamp(e.target.value)}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="fade-in fade-in-6">
                        {Array.isArray(filteredAndSortedData) && filteredAndSortedData.length > 0 &&
                            filteredAndSortedData.map((item, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }}>
                                    <td style={{ ...styles.table }}>{index + 1}</td>
                                    <td style={{ ...styles.table }}>{item.temp}</td>
                                    <td style={{ ...styles.table }}>{item.humidity}</td>
                                    <td style={{ ...styles.table }}>{item.light}</td>
                                    <td style={{ ...styles.table }}>
                                        {item.timestamp ? new Date(item.timestamp).toISOString().replace('T', ' ').substring(0, 19) : ''}
                                    </td>
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
                    justifyContent: 'center', // Căn giữa theo chiều ngang
                    alignItems: 'center', // Đảm bảo căn giữa theo chiều dọc
                    display: 'flex', // Đảm bảo sử dụng Flexbox
                    height: '100%', // Đảm bảo Row chiếm toàn bộ chiều cao của Container
                }} className="fade-in fade-in-8">
                    <Col lg={6} style={{
                        display: 'flex', // Sử dụng Flexbox cho Col
                        justifyContent: 'center', // Căn giữa theo chiều ngang bên trong Col
                        alignItems: 'center', // Căn giữa theo chiều dọc bên trong Col
                    }}>
                        {/* Pagination */}
                        <DataPagination
                            currentPage={data.page || 1}
                            totalPages={data.pages || 1}
                            onPageChange={handlePageChange}
                            style={{
                                display: 'flex', // Đảm bảo sử dụng Flexbox trong DataPagination
                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng của Col
                                backgroundColor: config.app.styles.backgroundColor
                            }}
                        />
                    </Col>
                </Row>
            </Container>

            {
                isLoading && <SpinnerComponent />
            }
        </Container>
    )
}
