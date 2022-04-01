import React from "react";



function Register() {

    // has not registered before
    if (true) {
        return (
                <div className="register">
                    <h1>Hello</h1>
                </div>
            )
    }else{
        return (
            window.location.replace("/video")
        );
    }

}

export default Register;