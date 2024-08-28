import { Container, Form, Table } from "react-bootstrap"
import SpinnerComponent from "./SpinnerComponent"
import { useState, useEffect } from "react"
import axios from 'axios'
import config from "../../config"

export default function ShowSubjectByMajor() {
    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([])
    const [majorSelect, setMajorSelect] = useState('default');
    const [spinner, setSpinner] = useState(false)
    const styles = {
        backgroundColor: config.app.styles.sideBarColor, color: '#adb5bd'
    }

    useEffect(() => {
        setSpinner(true)
        axios({
            url: config.backend.baseUrl + "/majors",
            method: 'POST',
        }).then((response) => {
            setMajors(response.data.msg);
            setTimeout(() => {
                setSpinner(false)
            }, 500)
        })
            .catch(err => { console.log(err); })
    }, [])
    useEffect(() => {
        setSpinner(true)
        axios(
            {
                url: config.backend.baseUrl + "/subjects",
                method: 'POST',
                data: {
                    major: majorSelect
                }
            }
        )
            .then((response) => {
                setSubjects(response.data.msg)
                setTimeout(() => {
                    setSpinner(false)
                }, 500)
            })
    }, [majorSelect])

    const handleSelect = (e) => {
        setMajorSelect(e.target.value)
    }
    return (
        <Container>
            <div>
                <Form.Select onChange={handleSelect} style={{ ...styles }} aria-label="Xem thông tin nghành học">
                    {
                        majors.map((major, index) => {
                            return <option key={index} value={major.type}>{major.name}</option>
                        })
                    }
                </Form.Select>
                <hr style={{
                    marginTop: 8,
                    marginBottom: 8,
                }}></hr>
                <div style={{
                    maxHeight: 590,
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Table striped bordered hover >
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th style={{ width: '20px' }}>#STT</th>
                                <th style={{ width: '400px' }}>Tên môn học</th>
                                <th style={{ width: '100px' }}>Mã Môn</th>
                                <th style={{ width: '70px' }}>Số tín chỉ</th>
                            </tr>
                        </thead>
                        <tbody>

                            {subjects.map((subject, index) => {
                                return <tr key={index} style={{ textAlign: 'center', ...styles }}>
                                    <td style={{ ...styles }}>{index + 1}</td>
                                    <td style={{ ...styles }}>{subject.name_subject}</td>
                                    <td style={{ ...styles }}>{subject.code_subject}</td>
                                    <td style={{ ...styles }}>{subject.stc}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>
                    {spinner && (
                        <div>
                            <SpinnerComponent />
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}