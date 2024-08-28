
import { useSelector } from "react-redux"
import config from "../config";
import ProfileComponent from "./user/ProfileComponent"
import DashboardComponent from './user/DashboardComponent'
import DevicesComponent from './user/DevicesComponent'
import DataStreamLogsComponent from "./user/DataStreamLogsComponent";

export default function MainLayoutComponent() {

    const { hookName, props } = useSelector((state) => state.hook)

    const MappingComponent = {
        '/#Dashboard': <DashboardComponent props={props} />,
        '/#Devices': <DevicesComponent props={props} />,
        '/#DataStreamLogs': <DataStreamLogsComponent props={props} />,
        '/#Profile': <ProfileComponent props={props} />,
    }
    const renderComponent = () => {
        return MappingComponent[hookName] ?? <DashboardComponent props={props} />
    }

    return (
        <div style={{
            maxHeight: '89vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            direction: 'rtl',
            flexWrap: 'wrap',
        }}>

            <div style={{ direction: 'ltr', color: config.app.styles.fontLink }}>
                {renderComponent()}
            </div>
        </div>
    )
}