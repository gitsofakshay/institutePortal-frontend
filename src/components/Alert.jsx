import React from 'react'

export default function Alert(props) {
    const alertHeight = props.alert ? "40px" : "0px";
    const capitalize = (word) => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{ height: alertHeight, transition: "height 0.3s ease" }}>
            {props.alert && (
                <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                    <strong>{`${capitalize(props.alert.type)} : `}</strong> {`${props.alert.msg}!`}
                </div>
            )}
        </div>
        // <div style={{ height: '40px' }}>
        //     {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
        //         <strong>{`${capitalize(props.alert.type)} : `}</strong> {`${props.alert.msg}!`}
        //     </div>}
        // </div>
    )
}
