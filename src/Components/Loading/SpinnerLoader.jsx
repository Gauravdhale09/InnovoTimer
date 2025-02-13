import React from "react";
import loading from "../../assets/images/ZZ5H.gif";

const SPLoader = ({ isLoading }) => {
    return (
        isLoading && (
            <div
                className="loader-overlay"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(5px)",
                    zIndex: 9999,
                }}
            >
                <img
                    src={loading}
                    className="spinner"
                    role="status"
                    alt="Loading..."
                    style={{
                        width: "3rem",
                        height: "3rem",
                    }}
                />
            </div>
        )
    );
};

export default SPLoader;