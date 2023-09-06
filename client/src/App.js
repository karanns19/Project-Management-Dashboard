import { useEffect, useState } from 'react';
import './App.css';
import check from './check.png';
import dustbin from './dustbin.png';
import About from './About';

const API_BASE = "http://localhost:3001";

function App() {

  const [tasks, setTasks] = useState([])
  const [navbar, setNavbar] = useState('Home')
  const [show, setShow] = useState(false);
  const [newTask, setNewTask] = useState("");

  useEffect(()=>{
    getTasks()
  },[])

  const getTasks = () => {
    fetch(API_BASE + '/tasks').then(res => res.json()).then(data => setTasks(data)).catch(err => console.error(err))
  }

  const deleteTasks = async (id) => {
    await fetch(API_BASE + '/task/delete/' + id, { method: "DELETE" }).then(res => res.json());
		setTasks(tasks => tasks.filter(task => task._id !== id));
  }

  const createTasks = async () => {
    const data = await fetch(API_BASE + "/task/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				task: newTask
			})
		}).then(res => res.json());

		setTasks([...tasks, data]);
		setShow(false);
  }

  const completeTasks = async (id) => {
    await fetch(API_BASE + '/task/complete/' + id, { method: "PUT" }).then(res => res.json())

    setTasks(tasks => tasks.map(task => {
			if (task._id === id) {
				task.status = true;
			}
			return task;
		}));
  }

  

  return (
    <div className="App">
      {show == true ? <><div id="popup-modal" class="boxBg fixed top-0 left-0 shadow place-items-center right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="modalBox w-4/12">
          <div class="relative bg-white rounded-lg shadow dark:bg-white-700">
            <div class="p-6 text-center">
                <h3 class="mb-5 text-2xl font-normal text-black-700 dark:text-black-800">Create New Project</h3>
                <label>Project Name: </label>
                <input onChange={e => setNewTask(e.target.value)}/>
                <button onClick={createTasks} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                    Yes, I'm sure
                </button>
                <button onClick={()=>{setShow(false)}} data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
            </div>
          </div>
        </div>
      </div></>:<></>}
      <div className="flex flex-wrap items-center p-10">
        <div className='w-8/12'>
          <h2 className='text-white text-4xl font-semibold'>ProjectOrbit</h2>
        </div>
        <div className='w-4/12'>
          <a href="#" onClick={()=>{setNavbar('Home')}} style={{backgroundColor: navbar === 'Home' ? 'rgb(2, 143, 252)':'transparent'}}>Home</a>
          <a href="#" onClick={()=>{setNavbar('About')}} style={{backgroundColor: navbar === 'About' ? 'rgb(2, 143, 252)':'transparent'}}>About</a>
        </div>
      </div>
      {navbar === 'Home' ? <>
      <div className='flex flex-wrap items-center pl-10 pt-10'>
        <button onClick={()=>{setShow(true)}}>Create New Project</button>
      </div>
      <div className="flex flex-wrap items-center p-10 pt-5">
        <div className='box w-6/12 text-white text-xl font-semibold p-5'>
          <h3>Project List (Pending)</h3>
          <div className='lists mt-5'>
            {tasks.map(function(data){
              return (
                <>
                {data.status == false ? <><div className='listsitem flex flex-wrap items-center p-2' key={data._id}>
                <div className='w-10/12'>
                  <h4 className='text-lg'>{data.task}</h4>
                </div>
                <div className='w-2/12 flex flex-wrap items-center justify-center'>
                <img src={check} width={28} title='Complete Task' onClick={() => completeTasks(data._id)} style={{cursor:'pointer'}}/>
                 <img src={dustbin} width={24} title='Delete Task' onClick={() => deleteTasks(data._id)} style={{cursor:'pointer'}}/>
                </div>
                </div></>:<></>}
                </>
              )
            })}
          </div>
        </div>
        <div className='box w-5/12 ml-5 text-white text-xl font-semibold p-5'>
          <h3>Project List (Completed)</h3>
          <div className='lists mt-5'>
            {tasks.map(function(data){
              return (
                <>
                {data.status == true ? <><div className='listsitem flex flex-wrap items-center p-2' key={data._id}>
                <div className='w-10/12'>
                  <h4 className='text-lg line-through'>{data.task}</h4>
                </div>
                <div className='w-2/12 flex flex-wrap items-center justify-center'>
                <img src={check} className='opacity-0' width={28} title='Complete Task' onClick={() => completeTasks(data._id)} style={{cursor:'pointer'}}/>
                <img src={dustbin} width={24} title='Delete Task' onClick={() => deleteTasks(data._id)} style={{cursor:'pointer'}}/>
                </div>
                </div></>:<></>}
                </>
              )
            })}
          </div>
        </div>
      </div>
      </>:<></>}

      {navbar === 'About' ? <About></About>:<></>}
    </div>
  );
}

export default App;
