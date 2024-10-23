import React from 'react';

const APIDocComponent = () => {
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <iframe
                src="http://localhost:5000/apidocs/"
                style={{ height: '100%', width: '100%', border: 'none' }}
                title="API Documentation"
            />
        </div>
    );
};

export default APIDocComponent;
