import {useState, useContext} from 'react'
import DisplayContext from '../context/DisplayContext'
import TimeframeSelector from '../TimeframeSelector/TimeframeSelector'
import Moment from 'react-moment'
import './History.css'

function History({onClick, timeSelection}) {

  const [sortConfig, setSortConfig] = useState({})

  const historyData = useContext(DisplayContext)

  let sortedData = [...historyData]

  const handleSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction })
  }

  if (sortConfig.key !== null) {
    sortedData?.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    });
  }

  console.log(sortedData)

  const historyTable = sortedData.map((date, i)=>{
    return (
      <tr key={i}>
        <td>
          <Moment format="MMMM D, YYYY HH:MM">{date.Date}</Moment>
        </td>
        <td>{date.High}</td>
        <td>{date.Low}</td>
        <td>{date.Open}</td>
        <td>{date.Close}</td>
        <td>{date.PercentChange}</td>
      </tr>
      )
  })

  return (
    <div>
        <TimeframeSelector onClick={onClick} timeSelection={timeSelection}/>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date <span 
                        className="sort-btn"
                        onClick={()=>handleSort('Date')}>
                       </span>
              </th>
              <th>High <span 
                        className="sort-btn"
                        onClick={()=>handleSort('High')}>
                       </span>
              </th>
              <th>Low <span
                        className="sort-btn"
                        onClick={()=>handleSort('Low')}>
                      </span>
              </th>
              <th>Open <span 
                        className="sort-btn" 
                        onClick={()=>handleSort('Open')}>
                       </span>
              </th>
              <th>Close <span 
                          className="sort-btn" 
                          onClick={()=>handleSort('Close')}>
                        </span>
              </th>
              <th>% Change <span 
                            className="sort-btn" 
                            onClick={()=>handleSort('Change')}>
                           </span>
              </th>
            </tr>
          </thead>
          {historyTable}
        </table>
    </div>
  );
};

export default History