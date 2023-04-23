import {useState, useEffect} from 'react'
import axios from 'axios'
import History from '../History/History'
import Overview from '../Overview/Overview'
import DisplayContext from '../context/DisplayContext'
import moment from 'moment'
import './Tabs.css'

function Tabs() {

  const [activeTab, setActiveTab] = useState('overview')
  const [value, setValue] = useState([])
  const [period, setPeriod] = useState('168')
  const [precision, setPrecision] = useState('Hours')
  const [timeframeSelection, setTimeframeSelection] = useState('4')
  const [cachedResponse, setCachedResponse] = useState(null)

  const handleClick = (tab) => {
    setActiveTab(tab)
  }

  // calculates start time and end time for api url
  function subtractDays(date, days) {
    date.setDate(date.getDate() - days)
    return date.toLocaleDateString()
  }
  const start = subtractDays(new Date(), 23)
  const endTime = moment().format('MM/DD/YYYY')

  const [startTime, setStartTime] = useState(start)

  // changes period and precision for api url
  const handleTimeframeSelection = (i) => {
    let start
    switch (i) {
      case '1':
        setPeriod('1')
        setPrecision('Minutes')
        setTimeframeSelection('1')
        start = subtractDays(new Date(), 1)
        setStartTime(start)
        break;
      case '2':
        setPeriod('5')
        setPrecision('Minutes')
        setTimeframeSelection('2')
        start = subtractDays(new Date(), 1)
        setStartTime(start)
        break;
      case '3':
        setPeriod('1')
        setPrecision('Hours')
        setTimeframeSelection('3')
        start = subtractDays(new Date(), 1)
        setStartTime(start)
        break;
      case '4':
        setPeriod('168')
        setPrecision('Hours')
        setTimeframeSelection('4')
        start = subtractDays(new Date(), 24)
        setStartTime(start)
        break;
      default:
        setPeriod('168')
        setPrecision('Hours')
        setTimeframeSelection('4')
        break;
    }
  }

  const chartURL = 
    'https://test.fxempire.com/api/v1/en/stocks/chart/candles?Identifier=AAPL.XNAS&IdentifierType=Symbol&AdjustmentMethod=All&IncludeExtended=True&period=' + period + 
    '&Precision=' + precision + '&StartTime=' + startTime + '&EndTime=' + endTime +
    '&_fields=ChartBars.StartDate,ChartBars.High,ChartBars.Low,ChartBars.StartTime,ChartBars.Open,ChartBars.Close,ChartBars.PercentChange'


  useEffect(()=> {
    const cachedData = JSON.parse(localStorage.getItem('cachedData'))
    if (cachedData && cachedData[chartURL]) {
      setValue(cachedData[chartURL])
      setCachedResponse(cachedData)
    } else {
      const historyData = async() => {      
        try {
          const response = await axios.get(chartURL)
          const responseData = response.data
          //if trading was inactive, the start day is updated to the last day of active trading
          if (responseData.length === 0) {
            let start = subtractDays(new Date(startTime), 1)
            setStartTime(start)
            return;
          }
          else {
            setValue(responseData)
            const newCache = {...cachedResponse, [chartURL]: responseData}
            localStorage.setItem('cachedData', JSON.stringify(newCache))
            setCachedResponse(newCache)
          }                    
        }
        catch (err) {
          console.error(err)
        }
      }
      historyData()
    }
  },[period, precision, startTime, endTime, chartURL])

  
  return (
    <div className='tabs'>

      <ul className='nav'>
        <li 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={()=> handleClick('overview')}>Overview</li>
        <li 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={()=> handleClick('history')}>History</li>
      </ul>
      <div className='outlet'>
        <DisplayContext.Provider value={value}>
          {activeTab === 'overview' 
          ? <Overview onClick={handleTimeframeSelection} timeSelection={timeframeSelection} /> 
          : <History onClick={handleTimeframeSelection} timeSelection={timeframeSelection} />}
        </DisplayContext.Provider>    
      </div>
    </div>
  );
};

export default Tabs
