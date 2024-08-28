import React, { useState, useEffect } from 'react';
import { socket } from '../../../socket';
import { useDispatch } from 'react-redux';
import { addDataStream } from '../../../redux/Streaming'

export default function WebSocketComponent() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        function onConnect() {
            console.log('Connected to the server');
            setIsConnected(true);
            const message = 'hello server!'
            console.log('client send: ', message)
            socket.emit('message', message);
        }

        function onDisconnect() {
            setIsConnected(false);
        }
        function onResponse(value) {
            console.log(value)
        }

        function onWellComeEvent(value) {
            console.log('received welcome event:', value);
            setFooEvents(previous => [...previous, value]);
        }

        function onStreamingAll(value) {
            console.log('received streaming/all:', value);
            dispatch(addDataStream(value))
        }

        socket.on('connect', onConnect);
        socket.on('response', onResponse);
        socket.on('streaming/all', onStreamingAll);


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('welcome', onWellComeEvent);
            socket.off('mqtt_message', onStreamingAll);

            // socket.disconnect();
        };
    }, [dispatch]);

    return (
        <></>
    );
}
