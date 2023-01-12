import { Button, Form, Modal } from "react-bootstrap";

const AnswerDialog = (props) => {
  const {show=false, onClose = ()=> {},item = {}} = props;

  const afterAnswer = async ()=> {
    const result = await window.electronAPI.update(item);
    console.log(result);
    onClose();
  }

  const handleRight = () => {
    if(item.times === 9 && item.priority < 5) {
      item.priority++;
      item.times = 0;
    } else {
      item.times++;
    }
    afterAnswer();
  }

  const handleWrong = () => {
    if(item.times === 0 && item.priority > 1) {
      item.priority--;
      item.times = 9;
    } else {
      item.times--;
    }
    afterAnswer();
  }



  return (
    <>
      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>回答</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>{item.title}</Form.Label>
              <Form.Control as="textarea"/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRight}>
            答对了！
          </Button>
          <Button variant="primary" onClick={handleWrong}>
            答错了！
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
} 

export default AnswerDialog;