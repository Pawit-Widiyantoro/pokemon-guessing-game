import PropTypes from "prop-types";

const Loading = ({ message }) => {
    return (
        <div className="flex justify-center items-center p-4">
            <svg
                className="animate-spin h-8 w-8 text-blue-500 mr-2"
                xmlns="http://w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />

                <path
                    className="opacity-75"
                    fill="currentColor"
                     d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.292A7.962 7.962 0 014 12H2c0 3.314 1.343 6.314 3.514 8.486l1.486-1.194z"
                />
            </svg>
            <p className="text-lg">{message || "Loading..."}</p>
        </div>
    );
};

Loading.propTypes = {
    message: PropTypes.string,
};

export default Loading;