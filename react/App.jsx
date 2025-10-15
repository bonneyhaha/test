import React, { useState, useEffect, useRef } from ‘react’;
import birdGif from ‘./assets/bird.gif’;
import notificationSound from ‘./assets/notification.mp3’;

const NotificationApp = () => {
const [notifications, setNotifications] = useState([]);
const [isConnected, setIsConnected] = useState(false);
const [employeeId] = useState(‘12345’); // Change this to your employee ID
const wsRef = useRef(null);
const audioRef = useRef(null);

useEffect(() => {
connectWebSocket();

```
return () => {
  if (wsRef.current) {
    wsRef.current.close();
  }
};
```

}, []);

const connectWebSocket = () => {
try {
// Connect to WebSocket server
const ws = new WebSocket(`ws://107.111.157.29:8080/ws/${employeeId}`);

```
  ws.onopen = () => {
    console.log('WebSocket Connected');
    setIsConnected(true);
  };

  ws.onmessage = (event) => {
    try {
      const notification = JSON.parse(event.data);
      handleNewNotification(notification);
    } catch (error) {
      console.error('Error parsing notification:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    setIsConnected(false);
  };

  ws.onclose = () => {
    console.log('WebSocket Disconnected');
    setIsConnected(false);
    
    // Reconnect after 5 seconds
    setTimeout(() => {
      connectWebSocket();
    }, 5000);
  };

  wsRef.current = ws;
} catch (error) {
  console.error('WebSocket connection error:', error);
  setIsConnected(false);
}
```

};

const handleNewNotification = (notification) => {
// Play notification sound
if (audioRef.current) {
audioRef.current.play().catch(e => console.log(‘Audio play failed:’, e));
}

```
// Add notification to list
setNotifications(prev => [notification, ...prev].slice(0, 5));

// Auto-remove after 10 seconds
setTimeout(() => {
  removeNotification(notification.id);
}, 10000);
```

};

const removeNotification = (id) => {
setNotifications(prev => prev.filter(n => n.id !== id));
};

const handleNotificationClick = (url) => {
if (url) {
window.open(url, ‘_blank’);
}
};

return (
<div style={styles.container}>
<audio ref={audioRef} src={notificationSound} />

```
  {/* Connection Status */}
  <div style={{
    ...styles.statusIndicator,
    backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
    color: isConnected ? '#86efac' : '#fca5a5'
  }}>
    <span style={styles.statusDot}>●</span>
    <span style={styles.statusText}>
      {isConnected ? 'Connected' : 'Disconnected'}
    </span>
  </div>

  {/* Main Content */}
  <div style={styles.mainContent}>
    {/* Notifications */}
    <div style={styles.notificationsContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={styles.notification}
          onClick={() => handleNotificationClick(notification.url)}
        >
          <button
            style={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ✕
          </button>

          <div style={styles.notificationContent}>
            <h3 style={styles.notificationTitle}>
              {notification.title}
            </h3>
            <p style={styles.notificationDescription}>
              {notification.description}
            </p>
            <div style={styles.timestamp}>
              {new Date(notification.timestamp || Date.now()).toLocaleTimeString()}
            </div>
          </div>

          <div style={styles.accentLine}></div>
        </div>
      ))}
    </div>

    {/* Bird Animation */}
    <div style={styles.birdContainer}>
      <img
        src={birdGif}
        alt="Bird"
        style={styles.birdImage}
      />
    </div>
  </div>
</div>
```

);
};

const styles = {
container: {
position: ‘fixed’,
top: 0,
left: 0,
right: 0,
bottom: 0,
pointerEvents: ‘none’,
},
statusIndicator: {
position: ‘absolute’,
top: ‘16px’,
right: ‘16px’,
display: ‘flex’,
alignItems: ‘center’,
gap: ‘8px’,
padding: ‘8px 12px’,
borderRadius: ‘8px’,
backdropFilter: ‘blur(10px)’,
pointerEvents: ‘auto’,
fontSize: ‘12px’,
fontWeight: ‘500’,
},
statusDot: {
fontSize: ‘10px’,
},
statusText: {
fontSize: ‘12px’,
},
mainContent: {
position: ‘absolute’,
right: ‘16px’,
bottom: ‘16px’,
display: ‘flex’,
alignItems: ‘flex-end’,
gap: ‘16px’,
},
notificationsContainer: {
display: ‘flex’,
flexDirection: ‘column’,
gap: ‘12px’,
pointerEvents: ‘auto’,
},
notification: {
position: ‘relative’,
background: ‘linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))’,
backdropFilter: ‘blur(20px)’,
borderRadius: ‘16px’,
boxShadow: ‘0 20px 25px -5px rgba(0, 0, 0, 0.5)’,
border: ‘1px solid rgba(75, 85, 99, 0.5)’,
cursor: ‘pointer’,
minWidth: ‘350px’,
maxWidth: ‘400px’,
transition: ‘transform 0.2s’,
animation: ‘slideIn 0.3s ease-out’,
},
closeButton: {
position: ‘absolute’,
top: ‘-8px’,
right: ‘-8px’,
backgroundColor: ‘#ef4444’,
color: ‘white’,
border: ‘none’,
borderRadius: ‘50%’,
width: ‘24px’,
height: ‘24px’,
display: ‘flex’,
alignItems: ‘center’,
justifyContent: ‘center’,
cursor: ‘pointer’,
fontSize: ‘12px’,
boxShadow: ‘0 4px 6px rgba(0, 0, 0, 0.3)’,
zIndex: 10,
},
notificationContent: {
padding: ‘20px’,
},
notificationTitle: {
color: ‘white’,
fontWeight: ‘bold’,
fontSize: ‘18px’,
marginBottom: ‘8px’,
marginRight: ‘16px’,
},
notificationDescription: {
color: ‘#d1d5db’,
fontSize: ‘14px’,
lineHeight: ‘1.5’,
margin: 0,
},
timestamp: {
marginTop: ‘12px’,
fontSize: ‘11px’,
color: ‘#6b7280’,
},
accentLine: {
height: ‘4px’,
background: ‘linear-gradient(90deg, #a855f7, #ec4899, #ef4444)’,
borderBottomLeftRadius: ‘16px’,
borderBottomRightRadius: ‘16px’,
},
birdContainer: {
pointerEvents: ‘none’,
marginBottom: ‘8px’,
},
birdImage: {
width: ‘128px’,
height: ‘128px’,
objectFit: ‘contain’,
filter: ‘drop-shadow(0 20px 25px rgba(0, 0, 0, 0.5))’,
},
};

export default NotificationApp;