import { Container, Table, Form, Row, Col } from "react-bootstrap";
import config from "../../config";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataPagination from "../activate/DataPagination";
import SearchFilterDate from "../activate/SearchFilterDate";
import SpinnerComponent from "../activate/SpinnerComponent";
import "../../assets/css/fadeIn.css";

export default function DataStreamLogsComponent({ props }) {
    const styles = {
        table: {
            borderRadius: '5px',
            textAlign: 'center',
            backgroundColor: config.app.styles.backgroundColor,
            color: config.app.styles.fontLink,
        }
    };

    const [isRealTime, setIsRealTime] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({ data: [] });  // Đảm bảo `data` có cấu trúc hợp lệ
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(50);

    useEffect(() => {
        const fetchData = () => {
            axios.post(config.backend.baseUrl + '/device/logs', {
                "page": currentPage,
                "per_page": perPage,
                "latest": true
            })
                .then(response => {
                    setData(response.data || { data: [] });  // Nếu không có data, trả về mảng rỗng
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        fetchData();

        if (isRealTime) {
            const interval = setInterval(fetchData, 3000);
            return () => clearInterval(interval);
        }
    }, [currentPage, perPage, isRealTime]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setIsLoading(true);
    };

    const handlePerPageChange = (perPageNumber) => {
        setPerPage(parseInt(perPageNumber));
        setCurrentPage(1);
        setIsLoading(true);
    };

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filterValue, setFilterValue] = useState('');

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        // Kiểm tra nếu `data.data` là mảng trước khi thực hiện sắp xếp
        let sortableItems = Array.isArray(data.data) ? [...data.data] : [];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data.data, sortConfig]);

    return (
        <Container>
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
                <h1 style={{ marginBottom: 16 }}>Action History</h1>
                <Row style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: config.app.styles.fontLink,
                    gap: '16px',
                }}>
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

                    <SearchFilterDate />
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
                            <th style={{ ...styles.table, fontSize: '18px', textAlign: 'center', verticalAlign: 'middle' }}>
                                #
                            </th>
                            <th style={{ ...styles.table, fontSize: '18px', textAlign: 'center', verticalAlign: 'middle' }}>
                                Device
                                <button
                                    onClick={() => handleSort('device_name')}
                                    style={{ backgroundColor: config.app.styles.backgroundColor, border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    <i className="bi bi-funnel"></i>
                                </button>
                            </th>
                            <th style={{ ...styles.table, fontSize: '18px', textAlign: 'center', verticalAlign: 'middle' }}>Topic</th>
                            <th style={{ ...styles.table, fontSize: '18px', textAlign: 'center', verticalAlign: 'middle' }}>Command</th>
                            <th style={{ ...styles.table, fontSize: '18px', textAlign: 'center', verticalAlign: 'middle' }}>Status</th>
                            <th style={{ ...styles.table, fontSize: '18px', textAlign: 'center', verticalAlign: 'middle' }}>
                                Timestamp
                                <button
                                    onClick={() => handleSort('timestamp')}
                                    style={{ backgroundColor: config.app.styles.backgroundColor, border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    <i className="bi bi-funnel"></i>
                                </button>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="fade-in fade-in-6">
                        {Array.isArray(sortedData) && sortedData.length > 0 && sortedData
                            .filter((item) =>
                                item.device_name.toLowerCase().includes(filterValue.toLowerCase())
                            )
                            .map((item, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }}>
                                    <td style={{ ...styles.table }}>{index + 1}</td>
                                    <td style={{ ...styles.table }}>{item.device_name.split('/')[0].toUpperCase()}</td>
                                    <td style={{ ...styles.table }}>{item.device_name}</td>
                                    <td style={{ ...styles.table }}>{item.command}</td>
                                    <td style={{ ...styles.table }}>{item.status}</td>
                                    <td style={{ ...styles.table }}>{item.timestamp.replace('.000000', '')}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>
            <Container style={{
                position: 'fixed',
                bottom: 0,
                zIndex: 1000,
                backgroundColor: config.app.styles.backgroundColor,
                paddingTop: 12,
                width: '77%',
                height: 60
            }}>
                <Row style={{
                    justifyContent: 'center',  // Căn giữa theo chiều ngang
                    alignItems: 'center',      // Căn giữa theo chiều dọc
                    display: 'flex',           // Kích hoạt Flexbox
                    height: '100%',            // Chiếm toàn bộ chiều cao của Container
                }} className="fade-in fade-in-8">
                    <Col lg={6} style={{
                        display: 'flex',            // Kích hoạt Flexbox trong Col
                        justifyContent: 'center',   // Căn giữa nội dung theo chiều ngang trong Col
                        alignItems: 'center',       // Căn giữa nội dung theo chiều dọc trong Col
                    }}>
                        <DataPagination
                            currentPage={data.page}
                            totalPages={data.pages}
                            onPageChange={handlePageChange}
                            style={{
                                display: 'flex',          // Sử dụng Flexbox trong DataPagination
                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                alignItems: 'center',     // Căn giữa theo chiều dọc
                                width: '100%',            // Chiếm toàn bộ chiều rộng của Col
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
