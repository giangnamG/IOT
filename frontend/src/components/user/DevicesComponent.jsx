import { Container, Table } from "react-bootstrap"
import '../../assets/css/fadeIn.css'
import config from "../../config"
import WebSocketComponent from '../helper/socket/WebSocketComponent'


export default function DevicesComponent({ props }) {
    const styles = {
        table: {
            borderRadius: '5px',
            textAlign: 'center', backgroundColor: config.app.styles.backgroundColor,
            color: config.app.styles.fontLink,
        }
    }

    return (
        <Container>
            <h1 className="fade-in fade-in-1">Devices</h1>
            <WebSocketComponent />
            <Table striped bordered hover style={{ width: '90%' }}>
                <thead className="fade-in fade-in-2">
                    <tr>
                        <th style={{ ...styles.table, fontSize: '18px', }}>#</th>
                        <th style={{ ...styles.table, fontSize: '18px', }}>ID</th>
                        <th style={{ ...styles.table, fontSize: '18px', }}>Thiết Bị</th>
                        <th style={{ ...styles.table, fontSize: '18px', }}>Thông Số</th>
                        <th style={{ ...styles.table, fontSize: '18px', }}>Thời Gian</th>
                    </tr>
                </thead>
                <tbody className="fade-in fade-in-3">
                    <tr>
                        <td style={{ ...styles.table }}>1</td>
                        <td style={{ ...styles.table }}>Mark</td>
                        <td style={{ ...styles.table }}>Otto</td>
                        <td style={{ ...styles.table }}>@mdo</td>
                        <td style={{ ...styles.table }}>@mdo</td>
                    </tr>
                    <tr>
                        <td style={{ ...styles.table }}>1</td>
                        <td style={{ ...styles.table }}>Mark</td>
                        <td style={{ ...styles.table }}>Otto</td>
                        <td style={{ ...styles.table }}>@mdo</td>
                        <td style={{ ...styles.table }}>@mdo</td>
                    </tr>
                    <tr>
                        <td style={{ ...styles.table }}>1</td>
                        <td style={{ ...styles.table }}>Mark</td>
                        <td style={{ ...styles.table }}>Otto</td>
                        <td style={{ ...styles.table }}>@mdo</td>
                        <td style={{ ...styles.table }}>@mdo</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}