import {useState, useEffect} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {wsUrl} from '../../consts/consts'
import Moment from 'react-moment'
import './Header.css'

function Header() {
  const [percentChange, setPercentChange] = useState(0)
  const [change, setChange] = useState(0)
  const [changePositive, setChangePositive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')
  const [price, setPrice] = useState(0)
  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(wsUrl)

  sendJsonMessage({"type":"SUBSCRIBE","instruments":["s-aapl"]})

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  useEffect(()=> {
    const lastData = lastJsonMessage || ''
    const data = lastData['s-aapl']
    setPercentChange(data?.percentChange)
    setChange(data?.change)
    if (data?.change > 0) {
      setChangePositive(true)
    }
    setLastUpdate(data?.lastUpdate)
    setPrice(data?.last)
  },[lastJsonMessage])


  return (
    <div className="header-container">
      <div className="header-title">
        <h1>Apple Inc</h1>
        <p>As of: <Moment format="MMMM D, YYYY hh:mm">{lastUpdate}</Moment> UTC</p>
      </div>
      <div className="header-data">
        <p className="price">
          <span className={changePositive ? 'arrow-up' : 'arrow-down'}></span>
          {price}
        </p>
        <div className="data-change">
          <span className={changePositive ? 'positive' : 'negative'}>{changePositive ? '+' : ''}{change}</span>
          <span className={changePositive ? 'positive' : 'negative'}>{changePositive ? '+' : ''}({percentChange}%)</span>
        </div>
      </div>
    </div>
  )
}

export default Header