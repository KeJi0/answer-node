import Button  from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './AccordionList.css';
import { useState } from 'react';
const AccordionList = (props) => {
  const {edit = false,list = [],updatedList= [],onDelete = (item)=> {}} = props;
  const [,setUpdate] = useState();
  //修改要更新的数据
  const modUpdateList = (item)=> {
    var updateIndex  = updatedList.findIndex(i => i.id === item.id);
    if(updateIndex === -1) {
      updatedList.push(item);
    } else {
      updatedList[updateIndex] = item;
    }
  }
  const createAccBody = (item,index) => {
    var references = JSON.parse(item.reference);
    if(edit === true) {
      return (
        <>
          <ButtonGroup aria-label="添加">
            <Button variant="primary" onClick={()=>{ 
              const newId = references.length > 0 ? 
                references[references.length-1].id+1:1;
              references.push({id:newId});
              console.log(references);
              item.reference = JSON.stringify(references);
              modUpdateList(item);
              setUpdate({});
            }}>添加引用</Button>
            <Button variant='primary' onClick={()=> {
              onDelete(item);
              const rmRefIndex = list.findIndex(r => 
                r.id === item.id);
              list.splice(rmRefIndex,1);
              const rmRefUpIndex = updatedList.findIndex(r => 
              r.id === item.id);
              if(rmRefUpIndex >= 0) {
                updatedList.splice(rmRefUpIndex,1);
              }
              setUpdate({})
            }}>删除</Button>
            <Button variant="primary" onClick={()=>{
              alert('item.pic+1 and add to updateList,remember check repeat')
              }}>添加图片(暂未实现)</Button>
          </ButtonGroup>
          <InputGroup className='content'>
              <InputGroup.Text>答 案</InputGroup.Text>
              <Form.Control as="textarea" aria-label="答 案" defaultValue={item.content} 
              onChange = {(e) => {
                item.content = e.target.value;
                modUpdateList(item);
              }}/>
          </InputGroup>
          {references.map((reference) => (
            <InputGroup key={reference.id} className="reference">
              <InputGroup.Text as='input' 
                id={"reference_name"+(index+1)+"_"+(reference.id)} 
                onChange={(e)=> {
                  reference.name = e.target.value;
                  item.reference = JSON.stringify(references);
                  modUpdateList(item);
                }}
                defaultValue={reference.name}/>
              <Form.Control 
                id={"reference_url"+(index+1)+"_"+(reference.id)}
                aria-describedby="basic-addon3"
                onChange={(e)=> {
                  reference.url = e.target.value;
                  item.reference = JSON.stringify(references);
                  modUpdateList(item);
                }}
                defaultValue={reference.url} />
              <Button 
                variant="outline-secondary" 
                id={"reference_del_btn_"+(index+1)+"_"+(reference.id)}
                onClick={()=>{
                  const rmRefIndex = references.findIndex(r => 
                    r.id === reference.id);
                  references.splice(rmRefIndex,1);
                  item.reference = JSON.stringify(references);
                  modUpdateList(item);
                  setUpdate({});
                }}
                >
                -
              </Button>
            </InputGroup>
          ))}
        </>
      )
    } else {
      return (
        <>
          <p key={"content_"+(index+1)}>{item.content}</p>
          {references.map((reference,key) => (
              <InputGroup key={key+1} className="reference">
                <InputGroup.Text 
                  id={"reference_name"+(index+1)+"_"+(key+1)}
                  >
                  {reference.name}
                </InputGroup.Text>
                <Form.Control as="a" target="_blank"
                  id={"reference_url"+(index+1)+"_"+(key+1)}
                  aria-describedby="basic-addon3" href={reference.url}>
                  {reference.url}
                </Form.Control>
              </InputGroup>  
          ))}
        </>
      )
    } 
  }
  return (
    <Accordion defaultActiveKey="1">
      {
        list.map((item,index) => (
          <Accordion.Item key={"accordion_"+(index+1)} 
            eventKey={index}>
            <Accordion.Header>
              {item.title} -{String.fromCharCode(item.priority + 64)} #{index+1}
            </Accordion.Header>
            <Accordion.Body>
              {createAccBody(item,index)}  
            </Accordion.Body>
          </Accordion.Item>
        ))
      } 
    </Accordion>
  ); 
}

export default AccordionList;