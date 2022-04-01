import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as SWRTC from '@andyet/simplewebrtc';

// ====================================================================
// IMPORTANT SETUP
// ====================================================================
// Replace `YOUR_PUBLISHABLE_API_KEY` here with the Publishable API Key
// you received when signing up for SimpleWebRTC
// --------------------------------------------------------------------
const API_KEY = '15d3a1c84bb2df4361ad55cb';
// ====================================================================

const ROOM_NAME = 'YOUR_ROOM_NAME';
const ROOM_PASSWORD = 'YOUR_ROOM_PASSWORD';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

const store = SWRTC.createStore();

export default function VideoApp() {
    return <Provider store={store}>
        <SWRTC.Provider configUrl={CONFIG_URL}>
            {/* Render based on the connection state */}
            <SWRTC.Connecting>
                <h1>Connecting...</h1>
            </SWRTC.Connecting>

            <SWRTC.Connected>
                <h1>Connected!</h1>
                {/* Request the user's media */}
                <SWRTC.RequestUserMedia audio video auto />

                {/* Enable playing remote audio. */}
                <SWRTC.RemoteAudioPlayer />

                {/* Connect to a room with a name and optional password */}
                <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD}>
                    {props => {
                        return(
                            <div>
                                <h1>dhjfdsfds</h1>
                            </div>
                        )
                    }}
                </SWRTC.Room>
            </SWRTC.Connected>
        </SWRTC.Provider>
    </Provider>
}

