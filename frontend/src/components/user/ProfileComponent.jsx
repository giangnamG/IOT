import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import '../../assets/css/profile.css';
import '../../assets/css/swagger-custom.css';

export default function ProfileComponent() {
    return (
        <div className="profile-container">
            {/* Sidebar hiển thị thông tin cá nhân */}
            <div className="profile-sidebar">
                <h2>Profile</h2>
                <div className="profile-section">
                    <div className="profile-header">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Avatar"
                            className="profile-avatar"
                        />
                        <div className="profile-info">
                            <h1>Nguyễn Giang Nam</h1>
                            <p>Mã sinh viên: B21DCAT014</p>
                            <p>Lớp: D21CQAT02-B</p>
                            {/* Các đường dẫn tải về và xem trước báo cáo */}
                            <a href="/path/to/your/report.pdf" target="_blank" rel="noopener noreferrer" className="profile-pdf-link">
                                Download Report (PDF)
                            </a>
                            <a href="/path/to/your/report-preview.pdf" target="_blank" rel="noopener noreferrer" className="profile-pdf-link">
                                Preview Report (PDF)
                            </a>
                            <a href="https://github.com/giangnamG/IOT/" target="_blank" rel="noopener noreferrer" className="profile-github-link">
                                GitHub Profile
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Phần hiển thị tài liệu API với Swagger UI */}
            <div className="api-doc-section">
                <SwaggerUI url="http://localhost:5000/apispec_1.json" />
            </div>
        </div>
    );
}
