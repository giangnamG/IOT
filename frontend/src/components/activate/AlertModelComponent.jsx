import { Button, Modal, Alert } from 'react-bootstrap';

const styles = {
    marginRight: 100,
}
export default function AlertModelComponent({ showAlert, handleCloseShowAlert, messageAlert }) {
    return <>
        <Modal show={showAlert}
            onHide={handleCloseShowAlert}
            keyboard={false}
            style={styles}>
            <Alert show={showAlert} style={{ marginBottom: '0px', backgroundColor: 'black' }} variant="white">
                <Alert.Heading className='blink'>{messageAlert}</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={handleCloseShowAlert} variant="outline-success">
                        Close me
                    </Button>
                </div>
            </Alert>
        </Modal>
    </>
}