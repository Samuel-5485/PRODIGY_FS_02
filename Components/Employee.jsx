import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const Employee = () => {
  const [employee, setEmployee] = useState([])
  useEffect(() =>{
    axios.get('http://localhost:3000/auth/employee')
    .then(result => {
        if (result.data.Status) {
            setCategory(result.data.Result || []);
        } else {
            alert(result.data.Error);
        }
    })
    .catch(err => console.log(err));
  }, []);
  
  return (
    
      <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>       
            <h3>Employee List</h3>
        </div>
        <Link to='/dashboard/add_employee' className='btn btn-success'>Add Employee</Link>   
        <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Salary</th>
                            <th>Address</th>
                            <th>Image</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        { employee.map((employee) => (
                                <tr key={employee.name}>
                                    <td><img src={'http://localhost:3000/auth/images/' +e.image}alt=''></img></td>
                                    <td>{employee.email}</td>
                                    <td>{employee.address}</td>
                                    <td>{employee.salary}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            </div>
  )
}

export default Employee
