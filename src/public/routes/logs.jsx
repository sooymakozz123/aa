import React, {
	useState, useEffect
} from 'react';
import {
	Layout, Space, Grid, Row,
	Menu,
	Button, Input,

	message, notification
} from 'antd';

export default () => {
	const [logs, setLogs] = useState([]);
	useEffect(() => {
		WebSocket.prototype.defaultSend = WebSocket.prototype.send;
		WebSocket.prototype.send = function(data) {
			this.defaultSend(JSON.stringify(data));
		};

		const ws = new WebSocket(`ws://${location.hostname}:3001`);
		ws.onopen = () => {
			console.debug('WebSocket connected');
			ws.send({
				type: 'subscribe',
				target: 'logs'
			});
		};
		ws.onmessage = (message) => {
			const msg = JSON.parse(message.data);
			if(msg.type === 'subscription' && msg.target === 'logs') {
				setLogs(msg.data);
			}
		};
	}, []);


	return (
		<Row justify="center">
			<Space wrap direction="vertical">
				<Button
					type="primary"
				>
					Clear logs
				</Button>
				<Input.TextArea
					autoSize
					disabled
					value={logs}
				/>
			</Space>
		</Row>
	)
};