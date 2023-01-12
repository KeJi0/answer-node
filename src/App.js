import './App.css';
import Button from 'react-bootstrap/Button';
import AccordionList from './components/AccordionList/AccordionList';
import SearchField from './components/SearchField/SearchField';
import { useEffect, useState } from 'react';
import EditModal from './components/EditModal/EditModal';
import AnswerDialog from './components/AnswerDialog/AnswerDialog';
import RouletteWheelSelection from './providers/PrioritySelection/RouletteWheelSelection';

function App() {
  //获取窗口尺寸
  const getWindowSize = () => ({
    innerHeight:window.innerHeight,
    innerWidth:window.innerWidth
  })
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const handleResize = () => {
    setWindowSize(getWindowSize());
  }

  useEffect(()=> {
    //监听
    window.addEventListener("resize",handleResize);
    //销毁
    return ()=> window.removeEventListener("resize",handleResize);
  })
  const [list,setList] = useState([]);
  const [results,setResult] = useState([]);
  const updatedList = [];
  const query = async ()=> {
    const data = await window.electronAPI.findAll();
    setList(data); 
    setResult(data);
  }
  useEffect(()=> {
    query();
  },[])

  const handleDelete = async (item) => {
    await window.electronAPI.delete(item.id);
    setEdit(false);
  }
  const [enable,setEnable] = useState(false);
  const [edit,setEdit] = useState(false);
  const [showAlert,setShowAlert] = useState(false);
  const [timeId,setTimeId] = useState(null);
  const [answerItem,setAnswerItem] = useState({});

  useEffect(()=> {
    if(enable) {
      const id = setInterval(async () => {
          setShowAlert(true);
          const priorities = await window.electronAPI.findPriority();
          const priority = RouletteWheelSelection(priorities);
          const data =await window.electronAPI.findByPriority(priority);
          const random_num = parseInt(Math.random() * data.length);
          setAnswerItem(data[random_num]);
          await window.electronAPI.win2show();
        }, 600000);
      setTimeId(id);
    }else {
      clearInterval(timeId);
    }
    
  },[enable])

  
  const createBtn = () => {
    if(edit) {
      return (
          <>
          <Button style={{width:100}} onClick={ ()=> {
            query()
            setEdit(false);
          }}>返回</Button>
          <Button style={{width:80}} onClick={ async ()=> {
            console.log(updatedList);
            if(updatedList.length > 0) {
              const a = await window.electronAPI.updateAll(updatedList);
              console.log(a);
              query();
              setEdit(false);
            }
          }}>保存</Button>
          </>
      )
    }else {
      return (
        <>
          <Button variant='primary' style={{width:80}}
            onClick={()=> {setEnable(!enable)}}>
            {enable?"暂停":"开始"}
          </Button>
          <EditModal afterSave= {()=> {
            query()
          }}/>
          <Button style={{width:100}} onClick={ ()=> {
            setEdit(true);
          }}>编辑模式</Button>
        </>
      )
    }
  }
  return (
    <div className="App" 
      style={{width: windowSize.innerWidth,height:windowSize.innerHeight}}>
      <div className="App-header">
          <div style={{width:100}}></div>
          <SearchField onChange = {(value) => {
            if(value !== '') {
              console.log(value);
              const result = results.filter(r => r.title.includes(value));
              setList(result);
            }else {
              setList(results);
            }
            
          }}/> 
          {createBtn()}
      </div>
      <div className='App-body' style={{height:(windowSize.innerHeight-80)}}>
        <AccordionList edit={edit} list={list} updatedList = {updatedList} onDelete={handleDelete}/>
        <AnswerDialog show = {showAlert} onClose = {()=> {
          setShowAlert(false);
          query();
        }} item = {answerItem}/>
      </div>
    </div>
  );
}

export default App;
