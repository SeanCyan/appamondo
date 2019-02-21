import React from 'react';

function exportCsv(props) {

    return (
        <div className="exportCsv">
            <h1>Export NLC Data</h1>
            <button type="button" onClick={props.exportCsv}>Export as CSV</button>
        </div> 
    )
}

export default exportCsv;