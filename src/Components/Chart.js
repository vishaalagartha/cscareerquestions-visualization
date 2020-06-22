import React, { useEffect } from 'react'
import { renderChart } from './renderChart'

const tipStyle = {
    position: 'absolute',
    opacity: '0',
    textAlign: 'center',     
    width: '50px',   
    height: '40px',         
    padding: '2px',      
    fontSize: '14px',
    background: '#f50057', 
    border: '0px',    
    borderRadius: '8px',  
    pointerEvents: 'none'     
}

const Chart = ({independent, dependent, type, chartType}) => {

  useEffect(() => {
    renderChart(independent, dependent, type, chartType)
  }, [independent, dependent, type, chartType])

  return (
    <div>
      <div id='chart' style={{textAlign: 'center'}}>
        <div id='tooltip' style={tipStyle}/>
      </div>
    </div>
  )
}

export default Chart
