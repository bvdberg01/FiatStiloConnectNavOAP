# FiatStiloConnectNavOAP

Integrate Raspberry Pi with MCP2515 module into Fiat Stilo's CANbus network for enhanced connectivity and control. Use at your own risk!

## FiatStiloBackendApp
Node.js server that communicates with the Fiat Stilo's CAN network and sends websockets to the FiatStiloFrontendApp.

## FiatStiloFrontendApp
React app that utilizes the FiatStiloBackendApp to retrieve data from the CANbus.

## FiatStiloScripts
Various functions, such as controlling the OAP with the steering wheel.

## Installation
To install and use this project, follow these steps:

1. Clone the repository: `git clone https://github.com/bvdberg01/FiatStiloConnectNavOAP.git`
2. Install the required dependencies:
   ```
   cd FiatStiloConnectNavOAP
   npm install
   ``` 
3. Start the backend server:
   ```
   node server.js
   ```
4. Start the frontend app:
   ```
   cd ..
   cd FiatStiloFrontendApp
   npm start FiatStiloFrontendApp
   ```
5. Open your web browser and visit `http://localhost:3000` to access the Fiat Stilo frontend app.

## Contributing
Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](https://github.com/your-username/FiatStiloConnectNavOAP/blob/main/LICENSE) file for more details.
