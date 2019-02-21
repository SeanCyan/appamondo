import React from 'react';
import ExportCsv from './ExportCsv'

function form(props) {
    return (
        <div className="formContainer">
            <div className="searchField">
                <h1>Input your NLC code to retrieve data...</h1>
                <input type="text" className="search" onChange={props.updateNlcValue} placeholder="e.g 0375" />
                <button className="get-weather" onClick={props.getNLC}>Submit</button>
            </div>
            <div className="dataField">
                <h1>NLC Code: {props.nlcValue}</h1>
                <h2>Location Code: {props.locationCode}</h2>
                <h2>Location Name: {props.locationName}</h2>
                <h2>Location Type: {props.locationType}</h2>
                <h2>CRS Type: {props.crsType}</h2>
            </div>
            <div className="ticket">
               <input type="text" className="search" onChange={props.updateTicketValue} placeholder="Input ticket ID..."></input>
               <button onClick={props.updateTicket}>Add to Zendesk</button>
            </div>
            <ExportCsv
                exportCsv={props.exportCsv}
             />
        </div>
    );
}

export default form;