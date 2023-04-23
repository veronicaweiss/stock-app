import {useContext} from 'react'
import DisplayContext from '../context/DisplayContext'
import TimeframeSelector from '../TimeframeSelector/TimeframeSelector'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './Overview.css'

function Overview({onClick, timeSelection}) {
  const overviewData = useContext(DisplayContext)

  const chartPrices = overviewData?.reduce((acc, cur)=>{
    let {Close: close, Date: date} = cur
    let newDate = new Date(date)
    let timestamp = newDate.getTime()
    return [...acc,[timestamp, close]]
  },[])

  const options = {
    chart: {
      zoomType: "x"
    },
    title: {
        text: "Stock Data"
    },
    credits: {
      enabled: false
    },
    xAxis: {
      crosshair: {
        width: 1
      },
      labels: {
        format: "{value:%d %b %H:%M %p}",
        rotation: -50,
        align: 'right'
      }
    },
    tooltip: {
            formatter: function() {
                return  Highcharts.dateFormat('%e %b %Y', new Date(this.x)) + ' ' + this.y ;
            }
        },
    legend: {
      enabled: false
    },
    series: [{
      data: chartPrices
    }]
  }

  return (
    <div>
        <TimeframeSelector onClick={onClick} timeSelection={timeSelection}/>

         <HighchartsReact highcharts={Highcharts} options={options} />
        
    </div>
  );
};

export default Overview