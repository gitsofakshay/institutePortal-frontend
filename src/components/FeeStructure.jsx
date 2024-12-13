import React from 'react'

export default function FeeStructure() {
  return (
    <div className='container'>
      <h1 className='text-center my-5'>Fee Structure of Agrasen Institute Maihar</h1>
      <table className="table table-bordered border-primary">
        <thead className='table-primary'>
          <tr>
            <th scope="col">CN</th>
            <th scope="col">Course</th>
            <th scope="col">Duration</th>
            <th scope="col">Fee</th>
            <th scope="col">Scholorship</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>BCA</td>
            <td>3 years</td>
            <td>6000 semester</td>
            <td>No Scholorship</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>B.com</td>
            <td>3 years</td>
            <td>6000 semester</td>
            <td>No Scholorship</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>DCA</td>            
            <td>1 year</td>
            <td>6000 semester</td>
            <td>No Scholorship</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>PGDCA</td>
            <td>1 year</td>
            <td>6000 semester</td>
            <td>No Scholorship</td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>Tally ERP9</td>
            <td>1 year</td>
            <td>10000</td>
            <td>No Scholorship</td>
          </tr>
          <tr>
            <th scope="row">6</th>
            <td>MS Office</td>
            <td>6 Months</td>      
            <td>6000</td>      
            <td>No Scholorship</td>      
          </tr>
        </tbody>
      </table>
    </div>
  )
}
