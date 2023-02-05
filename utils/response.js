const response = ({message, success, data, error}) => {
    return {
        message: message || "Success",
        success: success,
        error: error || null,
        data: data || {},
    }
}

const response200 = ({data, message}) => {
    return response({
        data: data || {},
        success: true,
        message: message || "Success",
    });
}

const responseError = ({error, message, data}) => {
    return response({
        data: data || {},
        success: false,
        message: message || "Failed to do process, something error in server",
        error: error || [],
    })
}

export {response as default, response200, responseError};