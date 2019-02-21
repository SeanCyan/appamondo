import React, { Component } from 'react';
import Form from './Form'
import './normalize.css';
import './App.css';

class App extends Component {
  
  state = {
    nlcValue: '',
    ticketValue: '',
    locationCode: '',
    locationName: '',
    locationType: '',
    crsType: '',
    csvData: ''
  }

  updateNlcValue = (e) => {
    this.setState({
        nlcValue: e.target.value,
      });
  }

  updateTicketValue = (e) => {
    this.setState({
        ticketValue: e.target.value,
      });
  }

  getNLC = () => {
    if (this.state.nlcValue == '') {
      alert("Please insert your NLC code to continue.");
    } else {
    const API_KEY = process.env.REACT_APP_NLC_API_KEY;
    const url = `https://platform.appamondo.com/api/findNLCCode?nlc_code=${this.state.nlcValue}`;
    const obj = {
        headers: {
          authorization: 'Bearer ' + API_KEY,
      }
    }
    fetch(url, obj)
        .then(response => {
          if (response.status == 400) {
            alert('Invalid NLC code, please retry');
        } else {
          return response.json()
          } 
        })
        .then(nlc => this.setState({
          locationCode: nlc.location_code,
          locationName: nlc.location_name,
          locationType: nlc.location_type,
          crsType: nlc.crs_code
        }));
    };
};  

  updateTicket = () => { // NPM package 'Zendesk NodeJS API'
    const Zendesk = require('zendesk-node-api');
 
    const zendesk = new Zendesk({
      url: 'https://testamondo.zendesk.com',
      token: process.env.REACT_APP_ZEN_API_KEY,
      oauth: true
    });

    zendesk.tickets.update(`${this.state.ticketValue}`, {
      custom_fields: [{
        id: 360000001406,
        value: `${this.state.locationName}`
      }],
    })
    .then((result) => {
      if (result.description == 'Not found') {
        alert("Ticket ID not recognised, please try again");
      } else {
        console.log(result);
        alert("Thanks! Your ticket has been submitted.");
      }
    });
  }

   exportCsv = () => {
        let codes = [];
        for (let i = 1; i <= 10; i++) { 
            const API_KEY = process.env.REACT_APP_NLC_API_KEY;
            const url = `https://platform.appamondo.com/api/getNLCCodes?page=${i}`;
            const obj = {
            headers: {
              authorization: 'Bearer ' + API_KEY,
          }
        }
        fetch(url, obj)
            .then(response => response.json())
            .then(nlc => nlc.data)
            .then(data => data.forEach(object => {
                codes.push([object.id, 
                            object.nlc_code, 
                            object.location_code, 
                            object.location_name, 
                            object.location_type, 
                            object.crs_code]);
            }))
        }
        setTimeout(() => {
          this.setState({
            csvData: codes,
          })
          let csvRow = [];
          let headings = [["id", "nlc code", "location code", "location name", "location type", "crs code"]]
          let data = this.state.csvData;

          for (let i = 0; i < data.length; i++) {
            headings.push([data[i]]);
          }

          for (let i = 0; i < headings.length; i++) {
            csvRow.push(headings[i].join(","))
          }
          const csvString = csvRow.join("%0A");

          let a = document.createElement("a");
          a.href='data:attachment/csv,' + csvString;
          a.target="_Blank";
          a.download="nlccodes.csv";
          document.body.appendChild(a);
          a.click()
        }, 1000)
    };

  
  render() {
    return (
      <div className="App">
        <Form 
          getNLC={this.getNLC}
          updateNlcValue={this.updateNlcValue}
          nlcValue={this.state.nlcValue}
          locationCode={this.state.locationCode}
          locationName={this.state.locationName}
          locationType={this.state.locationType}
          crsType={this.state.crsType}
          updateTicketValue={this.updateTicketValue}
          updateTicket={this.updateTicket}
          exportCsv={this.exportCsv}
        />
      </div>
    );
  }
}

export default App;
