import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const EditModal = (props) => {
  const {afterSave = ()=> {}} = props;
  const [show, setShow] = useState(false);
  const item = {title:'',content:'',reference:'[]',priority:1};
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    const a = await window.electronAPI.save(item);
    console.log(a)
    setShow(false)
    afterSave();
  }

  return (
    <>
      <Button variant="primary" style={{width:80}} onClick={handleShow}>
        添加
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>添加项目</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>问 题</Form.Label>
              <Form.Control
                type="input"
                autoFocus
                onChange={(e)=> {item.title = e.target.value}}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>答案</Form.Label>
              <Form.Control as="textarea" onChange={(e)=> {item.content = e.target.value}}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
} 

export default EditModal;