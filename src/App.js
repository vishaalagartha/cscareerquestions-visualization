import React, { useState } from 'react';
import Chart from './Components/Chart'
import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap'


const App = () => {

  const [dependent, setDependent] = useState('Annual total compensation')
  const [independent, setIndependent] = useState('Ethnicity')
  const [type, setType] = useState('categorical')
  const [chartType, setChartType] = useState('Boxplot')

  const dependents = ['Annual total compensation',
    'Annual gross base pay',
    'Signing bonus',
    'Value of bonus',
    'Value of initial stock',
    'Value of additional stock']

  const categoricalIndependents = [
    'Job type',
    'Publicly-traded or privately-held',
    'Location',
    'Education level',
    'Ethnicity',
    'Gender',
    'Country',
    'Cost of living']

  const contIndependents = ['Cumulative work experience',
    'Time under employer',
    'Time in current position',
    'Age']

  const chartTypes = {'categorical': ['Barplot', 'Bubble', 'Boxplot'],
                      'continuous': ['Histogram', 'Boxplot', 'Scatter']}

  const independents = [...categoricalIndependents, ...contIndependents]

  return (
    <div>
      <Row style={{justifyContent: 'center'}}>
        <h1>
          r/CSCareerQuestions Survey Results
        </h1>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <Col xs={{offset: 2}}>
          <h3>
            Independent Variable:
          </h3>
          <DropdownButton title={independent}>
            {independents.map((ind, i) =>
            <Dropdown.Item key={i} onClick={() => { 
              setIndependent(ind)
              if(i<categoricalIndependents.length){
                setType('categorical')
                setChartType('Barplot')
              }
              else{
                setType('continuous')
                setChartType('Scatter')
              }
            }}>{ind}</Dropdown.Item>
            )}    
          </DropdownButton>
        </Col>
        <Col>
          <h3>
            Dependent Variable:
          </h3>
          <DropdownButton title={dependent}>
            {dependents.map((dep, i) => 
            <Dropdown.Item key={i} onClick={() => setDependent(dep)}>{dep}</Dropdown.Item>
            )}    
          </DropdownButton>
        </Col>
      </Row>
      <Row style={{marginTop: '20px'}}>
        <Col xs={{offset: 2}}>
          <h3>
            Chart Type
          </h3>
          <DropdownButton title={chartType}>
            {chartTypes[type].map((type, i) => 
            <Dropdown.Item key={i} onClick={() => setChartType(type)}>{type}</Dropdown.Item>
            )}    
          </DropdownButton>
        </Col>
      </Row>
      <Chart type={type} independent={independent} dependent={dependent} chartType={chartType}/>
    </div>
  )
}

export default App
