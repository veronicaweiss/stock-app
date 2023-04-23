import './TimeframeSelector.css'

function TimeframeSelector({onClick, timeSelection}) {
	return (
		<div>
			<ul>
				<li className={timeSelection === '1' ? 'active' : ''} onClick={()=> onClick('1')}>1 Minute</li>
				<li className={timeSelection === '2' ? 'active' : ''} onClick={()=> onClick('2')}>5 Minutes</li>
				<li className={timeSelection === '3' ? 'active' : ''} onClick={()=> onClick('3')}>1 Hour</li>
				<li className={timeSelection === '4' ? 'active' : ''} onClick={()=> onClick('4')}>1 Week</li>
			</ul>
		</div>
		)
}

export default TimeframeSelector

