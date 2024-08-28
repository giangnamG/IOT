import { useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"

import SpinnerComponent from "./SpinnerComponent"

export default function AddSubjectModel({ showRecordForm, setShowRecordForm }) {
    const [codeSubject, setCodeSubject] = useState('')
    const [groupAtAddRecord, setGroupAtAddRecord] = useState('')
    const [teamAtAddRecord, setTeamAtAddRecord] = useState('')
    const [spinnerAddRecord, setSpinnerAddRecord] = useState(false)


    const addRecordSubjects = () => {

    }

    return (
        <>
            <Modal
                show={showRecordForm}
                onHide={() => setShowRecordForm(false)}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add recording</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formGroupMSV">
                            <Form.Label>MMH</Form.Label>
                            <Form.Control onChange={(e) => { setCodeSubject(e.target.value) }} type="text" placeholder="Ví dụ: BAS1234 ..." />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupMSV">
                            <Form.Label>Nhóm</Form.Label>
                            <Form.Control onChange={(e) => { setGroupAtAddRecord(e.target.value) }} type="text" placeholder="Ví dụ: 03 ..." />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupMSV">
                            <Form.Label>Tổ</Form.Label>
                            <Form.Control onChange={(e) => { setTeamAtAddRecord(e.target.value) }} type="text" placeholder="Ví dụ: 01... (để trống nếu không có)" />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    {spinnerAddRecord ?
                        (<div>
                            <SpinnerComponent />
                        </div>) : null
                    }
                    <Button variant="secondary" onClick={() => setShowRecordForm(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addRecordSubjects}>Add</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}